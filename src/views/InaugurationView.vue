<template>
  <div class="relative min-h-screen w-full bg-black font-mono text-gray-100 flex flex-col justify-between overflow-x-hidden select-none">
    
    <!-- Animated LetterGlitch Background -->
    <div class="fixed inset-0 z-0 opacity-40">
      <LetterGlitch
        :glitch-speed="70"
        center-vignette
        :outer-vignette="false"
        smooth
        :glitch-colors="['#b40303', '#3c062d', '#442203']"
      />
    </div>

    <!-- Background CRT Overlay -->
    <div class="fixed inset-0 z-1 bg-[radial-gradient(circle,rgba(0,0,0,0)_60%,rgba(0,0,0,0.95)_100%)] pointer-events-none" />

    <!-- Top Classified Header -->
    <header class="relative z-10 w-full px-6 py-4 border-b border-red-900/40 bg-neutral-950/80 backdrop-blur-md flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div class="w-3 h-3 bg-red-600 rounded-full animate-ping" />
        <span class="font-orbitron font-extrabold text-sm sm:text-base tracking-widest text-white">
          MBC // <span class="text-red-500">INAUGURATION GATEWAY</span>
        </span>
      </div>

      <div class="flex items-center gap-4 text-xs text-gray-400">
        <span class="hidden sm:inline">CLEARANCE: <strong class="text-red-400">RESTRICTED</strong></span>
        <span class="text-[10px] uppercase text-gray-500">DISPLAY: {{ webSocketStatus }}</span>
        <router-link to="/" class="hover:text-red-400 text-[11px] underline">LANDING PAGE</router-link>
      </div>
    </header>

    <!-- Main Content Area -->
    <main class="relative z-10 flex-1 flex flex-col items-center justify-center p-4 sm:p-6 my-auto">
      
      <!-- AUTHORIZATION FORM STAGE (Before Authorization) -->
      <div v-if="!isAuthorized" class="w-full max-w-xl bg-neutral-950/90 border border-red-700/80 p-6 sm:p-8 rounded-xl shadow-[0_0_50px_rgba(255,0,50,0.4)] backdrop-blur-xl space-y-6">
        
        <!-- Header & Instructions -->
        <div class="text-center space-y-2">
          <div class="inline-flex items-center gap-2 px-3 py-1 bg-red-950/80 border border-red-700/60 rounded text-[11px] font-bold text-red-400 tracking-widest uppercase">
            <Lock class="w-3.5 h-3.5 text-red-500" />
            <span>AUTHORIZATION REQUIRED</span>
          </div>

          <h2 class="font-orbitron text-2xl sm:text-3xl font-black tracking-wider text-white uppercase">
            INAUGURATION AUTHENTICATION
          </h2>

          <p class="text-xs text-gray-400 tracking-wider">
            ENTER THE CLASSIFIED AUTHORIZATION CIPHER TO ACTIVATE THE CELL.
          </p>
        </div>

        <!-- CIPHER AUTHORIZATION FORM -->
        <form @submit.prevent="handleAuthenticate" class="space-y-4">
          
          <!-- Input Field -->
          <div class="space-y-2">
            <label class="block text-xs font-bold text-gray-300 uppercase tracking-widest">
              AUTHORIZATION CIPHER
            </label>
            
            <div 
              :class="[
                'relative flex items-center bg-black border rounded px-4 py-3 transition-all',
                isError ? 'border-red-500 bg-red-950/30 animate-shake shadow-[0_0_15px_rgba(255,0,50,0.6)]' : 'border-red-900/80 focus-within:border-red-500'
              ]"
            >
              <Key class="w-5 h-5 text-red-500 mr-3" />
              
              <input
                v-model="cipherInput"
                type="text"
                :disabled="isVerifying"
                placeholder="ENTER CIPHER (e.g. CYBER-CELL-2026)..."
                class="w-full bg-transparent text-red-300 font-mono text-sm sm:text-base focus:outline-none placeholder-red-900/60 uppercase tracking-wider"
              />
            </div>
          </div>

          <!-- VERIFYING STATUS & PROGRESS -->
          <div v-if="isVerifying" class="space-y-2 pt-2">
            <div class="flex justify-between text-xs font-bold text-red-400 uppercase">
              <span>{{ statusText }}</span>
              <span>{{ progress }}%</span>
            </div>
            <div class="w-full bg-neutral-900 h-2 rounded-full overflow-hidden border border-red-900/60">
              <div 
                class="bg-gradient-to-r from-red-700 to-red-500 h-full transition-all duration-300"
                :style="{ width: `${progress}%` }"
              />
            </div>
          </div>

          <!-- ERROR RESPONSE BANNER -->
          <div v-if="isError" class="p-3 bg-red-950/80 border border-red-600 rounded text-center space-y-1 animate-fade-in">
            <div class="flex items-center justify-center gap-2 text-red-400 font-orbitron font-bold text-sm tracking-wider uppercase">
              <AlertTriangle class="w-4 h-4 text-red-500" />
              <span>AUTHORIZATION FAILED</span>
            </div>
            <div class="text-xs text-red-300/80 font-mono">
              ACCESS DENIED // INVALID AUTHORIZATION CIPHER
            </div>
          </div>

          <!-- PRIMARY INAUGURATE BUTTON -->
          <button
            type="submit"
            :disabled="isVerifying || !cipherInput.trim() || !isWebSocketReady"
            class="w-full py-4 bg-gradient-to-r from-red-700 via-red-600 to-red-800 hover:from-red-600 hover:to-red-700 disabled:opacity-50 text-white font-orbitron text-base font-black tracking-[0.2em] uppercase rounded shadow-[0_0_25px_rgba(255,0,50,0.6)] transition-all cursor-pointer disabled:cursor-not-allowed flex items-center justify-center gap-3"
          >
            <ShieldAlert class="w-5 h-5" />
            <span>{{ isCommandSent ? 'AUTHORIZATION SENT' : 'INAUGURATE' }}</span>
          </button>
          <div v-if="!isWebSocketReady" class="text-center text-[11px] text-amber-300 uppercase tracking-wider">
            DISPLAY LINK OFFLINE. CONNECT WEBSOCKET BACKEND TO ENABLE INAUGURATION.
          </div>
        </form>

        <!-- PUBLIC GENERATOR SECTION (Intentionally NOT Valid) -->
        <div class="pt-4 border-t border-neutral-900 text-center space-y-3">
          <div class="text-[11px] text-gray-500 uppercase tracking-widest">
            PUBLIC VISITOR TOOLS (DEMO CIPHER SIMULATOR)
          </div>

          <button
            type="button"
            @click="generatePublicCipher"
            class="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 hover:border-neutral-700 text-gray-300 text-xs font-mono rounded transition-colors cursor-pointer flex items-center justify-center gap-2 mx-auto"
          >
            <RefreshCw class="w-3.5 h-3.5 text-gray-400" />
            <span>GENERATE PUBLIC CIPHER TEXT</span>
          </button>

          <div v-if="generatedPublicCipher" class="p-2 bg-black/80 border border-neutral-800 rounded text-xs font-mono text-gray-400 flex items-center justify-between">
            <span class="text-red-400/80">{{ generatedPublicCipher }}</span>
            <button 
              @click="copyGeneratedCipher" 
              class="text-[10px] bg-neutral-800 px-2 py-1 rounded text-gray-300 hover:text-white"
            >
              {{ copied ? 'COPIED!' : 'COPY TO INPUT' }}
            </button>
          </div>
        </div>

      </div>

      <div v-else class="w-full max-w-xl bg-neutral-950/90 border border-emerald-700/70 p-6 sm:p-8 rounded-xl shadow-[0_0_50px_rgba(16,185,129,0.35)] backdrop-blur-xl space-y-5 text-center">
        <div class="inline-flex items-center gap-2 px-3 py-1 bg-emerald-950/70 border border-emerald-600/60 rounded text-[11px] font-bold text-emerald-300 tracking-widest uppercase">
          <ShieldAlert class="w-3.5 h-3.5" />
          <span>COMMAND DISPATCHED</span>
        </div>

        <h2 class="font-orbitron text-2xl sm:text-3xl font-black tracking-wider text-white uppercase">
          MAIN DISPLAY TRIGGERED
        </h2>

        <p class="text-xs sm:text-sm text-emerald-200/90 tracking-wide uppercase">
          PLAY_VIDEO SENT. THE CEREMONY VIDEO WILL START ON THE MAIN DISPLAY AT /
        </p>

        <router-link
          to="/"
          class="inline-flex items-center justify-center px-5 py-2 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-gray-200 rounded text-xs font-bold tracking-wider uppercase transition-colors"
        >
          RETURN TO LANDING PAGE
        </router-link>
      </div>

    </main>

    <!-- Footer System Info -->
    <footer class="relative z-10 w-full px-6 py-3 border-t border-neutral-900 bg-black/90 text-center text-[11px] text-gray-600 font-mono">
      SYSTEM GATEWAY v4.0.9 // QUANTUM ENCRYPTION AES-256
    </footer>

  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { Lock, Key, AlertTriangle, ShieldAlert, RefreshCw } from 'lucide-vue-next';
import LetterGlitch from '../components/LetterGlitch.vue';
import { cyberAudio } from '../utils/cyberAudio';
import { useWebSocket } from '../utils/useWebSocket';

// VALID AUTHORIZATION CIPHER (Supports CYBER-CELL-2026, MBC-2026, INAUGURATE-2026)
const VALID_CIPHERS = ['CYBER-CELL-2026', 'MBC-2026', 'INAUGURATE-2026'];
const cipherInput = ref('');
const isVerifying = ref(false);
const isAuthorized = ref(false);
const isError = ref(false);
const progress = ref(0);
const statusText = ref('VERIFYING AUTHORIZATION...');
const generatedPublicCipher = ref('');
const copied = ref(false);
const isCommandSent = ref(false);

const { status: webSocketStatus, send } = useWebSocket(() => undefined);
const isWebSocketReady = computed(() => webSocketStatus.value === 'connected');

const handleAuthenticate = () => {
  isError.value = false;
  const inputNormalized = cipherInput.value.trim().toUpperCase();

  // Check if valid
  if (!VALID_CIPHERS.includes(inputNormalized)) {
    // TRIGGER CINEMATIC FAILURE
    cyberAudio.playAccessDenied();
    isError.value = true;
    return;
  }

  // VALID CIPHER FLOW
  if (!send({ type: 'PLAY_VIDEO' })) {
    isError.value = true;
    statusText.value = 'DISPLAY CONNECTION UNAVAILABLE';
    return;
  }

  cyberAudio.playClick();
  isCommandSent.value = true;
  isVerifying.value = true;
  progress.value = 0;
  statusText.value = 'VERIFYING AUTHORIZATION...';

  const interval = setInterval(() => {
    progress.value += 20;
    cyberAudio.playAuthProgress();

    if (progress.value >= 100) {
      clearInterval(interval);
      statusText.value = 'AUTHORIZATION VERIFIED';
      
      setTimeout(() => {
        isVerifying.value = false;
        isAuthorized.value = true;
      }, 600);
    }
  }, 300);
};

// PUBLIC CIPHER GENERATOR (Intentionally NOT Valid)
const generatePublicCipher = () => {
  cyberAudio.playClick();
  copied.value = false;
  const randomHex = Math.random().toString(16).substring(2, 8).toUpperCase();
  generatedPublicCipher.value = `GUEST-PUBLIC-${randomHex}-TOK`;
};

const copyGeneratedCipher = () => {
  if (!generatedPublicCipher.value) return;
  cyberAudio.playClick();
  cipherInput.value = generatedPublicCipher.value;
  copied.value = true;
  setTimeout(() => (copied.value = false), 2000);
};
</script>

<style scoped>
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  20%, 60% { transform: translateX(-8px); }
  40%, 80% { transform: translateX(8px); }
}

.animate-shake {
  animation: shake 0.4s ease-in-out;
}
</style>
