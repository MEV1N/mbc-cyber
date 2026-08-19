<template>
  <div class="relative w-screen h-screen overflow-hidden bg-black font-mono select-none flex items-center justify-center">
    
    <!-- Animated LetterGlitch Red Background -->
    <div class="fixed inset-0 z-0">
      <LetterGlitch
        :glitch-speed="50"
        center-vignette
        :outer-vignette="false"
        smooth
        :glitch-colors="['#b40303', '#3c062d', '#442203']"
      />
    </div>

    <!-- Scanline & Noise Overlay -->
    <div class="fixed inset-0 z-1 bg-[radial-gradient(circle,rgba(0,0,0,0)_50%,rgba(0,0,0,0.85)_100%)] pointer-events-none" />

    <!-- Main Container -->
    <main v-if="!isCinematicPlaying" class="relative z-10 flex flex-col items-center justify-center p-6 text-center max-w-3xl mx-auto">

      <!-- Title & System Text -->
      <h1 class="font-orbitron text-4xl sm:text-6xl font-black text-white tracking-widest uppercase mb-3 drop-shadow-[0_0_20px_rgba(255,0,50,0.7)]">
        Warning
      </h1>

      <p class="text-xs sm:text-sm text-gray-400 tracking-[0.25em] uppercase mb-8">
        RESTRICTED ACCESS // INAUGURATION TERMINAL
      </p>

      <button
        type="button"
        @click="enableCeremony"
        class="mb-6 border border-red-900/70 px-3 py-1 text-[10px] uppercase tracking-widest text-red-400 hover:border-red-500 hover:text-red-300"
      >
        {{ isDisplayEnabled ? 'CEREMONY ENABLED' : 'ENABLE CEREMONY' }}
      </button>
      <div class="mb-6 text-[10px] uppercase tracking-widest text-gray-500">
        DISPLAY LINK: {{ webSocketStatus }}
      </div>

      <!-- PRE-AUTH STATE: INITIATE ACCESS BUTTON -->
      <div v-if="state === 'idle'" class="space-y-6">
        <button
          @click="startAuthentication"
          class="group relative px-10 py-4 text-base sm:text-lg font-orbitron font-extrabold uppercase tracking-widest text-black bg-gradient-to-r from-red-600 via-red-500 to-red-700 hover:from-red-500 hover:to-red-600 rounded cursor-pointer transition-all duration-200 active:scale-95 shadow-[0_0_30px_rgba(255,0,50,0.8)] border border-red-400/60 overflow-hidden"
        >
          <div class="relative z-10 flex items-center gap-3">
            <Lock class="w-5 h-5 text-black group-hover:scale-110 transition-transform" />
            <span>INITIATE ACCESS</span>
          </div>
        </button>
      </div>

      <!-- AUTHENTICATING STATE: TERMINAL LOGS -->
      <div v-else-if="state === 'authenticating'" class="w-full max-w-md bg-neutral-950/90 border border-red-700 p-6 rounded-lg shadow-2xl space-y-3">
        <div class="flex items-center gap-2 text-red-500 text-xs font-bold border-b border-red-900/60 pb-2">
          <Terminal class="w-4 h-4 animate-spin" />
          <span>AUTHENTICATING SECURE CHANNEL</span>
        </div>
        <div class="text-xs text-red-400 font-mono space-y-2 text-left">
          <div v-for="(log, idx) in logs" :key="idx" class="flex gap-2">
            <span class="text-red-600">&gt;</span>
            <span>{{ log }}</span>
          </div>
        </div>
      </div>

      <!-- REVEALED STATE: QR CODE & NAVIGATION -->
      <div v-else-if="state === 'revealed'" class="space-y-6 animate-fade-in">
        
        <!-- Scannable QR Code -->
        <QRCodeRenderer 
          :value="inaugurationUrl" 
          label="SCAN TO CONTINUE INAUGURATION" 
        />

        <!-- Direct Navigation Link for Testing -->
        <div class="pt-4 flex flex-col items-center gap-2">
          <router-link
            to="/inaugurate"
            class="inline-flex items-center gap-2 px-5 py-2 bg-neutral-950 hover:bg-neutral-900 border border-red-600/70 text-red-400 hover:text-white rounded text-xs font-bold tracking-wider uppercase transition-colors cursor-pointer"
          >
            <span>PROCEED TO INAUGURATION PAGE</span>
            <ExternalLink class="w-3.5 h-3.5" />
          </router-link>
          <span class="text-[10px] text-gray-500">URL Target: {{ inaugurationUrl }}</span>
        </div>

      </div>

    </main>

    <video
      ref="videoRef"
      v-show="isCinematicPlaying"
      class="fixed inset-0 z-20 h-screen w-screen bg-black object-contain"
      src="/video.mp4"
      playsinline
      preload="auto"
      controls
    />

    <div v-if="playbackNotice" class="fixed bottom-6 left-1/2 z-30 -translate-x-1/2 border border-red-600 bg-black/90 px-4 py-2 text-center text-xs text-red-300">
      {{ playbackNotice }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { nextTick, ref } from 'vue';
import { Lock, Terminal, ExternalLink } from 'lucide-vue-next';
import LetterGlitch from '../components/LetterGlitch.vue';
import QRCodeRenderer from '../components/QRCodeRenderer.vue';
import { cyberAudio } from '../utils/cyberAudio';
import { useWebSocket } from '../utils/useWebSocket';

// CONFIGURABLE PRODUCTION URL VARIABLE
const INAUGURATION_URL = typeof window !== 'undefined' 
  ? `${window.location.origin}/inaugurate`
  : 'https://mbccyber.com/inaugurate';

const inaugurationUrl = ref(INAUGURATION_URL);
const state = ref<'idle' | 'authenticating' | 'revealed'>('idle');
const logs = ref<string[]>([]);
const isCinematicPlaying = ref(false);
const isDisplayEnabled = ref(false);
const playbackNotice = ref('');
const videoRef = ref<HTMLVideoElement | null>(null);

const enableCeremony = () => {
  isDisplayEnabled.value = true;
  playbackNotice.value = '';
  const video = videoRef.value;
  if (!video) return;

  if (isCinematicPlaying.value && !video.paused) {
    video.muted = false;
    return;
  }

  video.muted = true;
  video.play().then(() => {
    video.pause();
    video.currentTime = 0;
    video.muted = false;
  }).catch(() => {
    playbackNotice.value = 'CEREMONY DISPLAY COULD NOT BE ACTIVATED';
  });
};

const handlePlayVideo = async () => {
  isCinematicPlaying.value = true;
  await nextTick();
  const video = videoRef.value;
  if (!video) return;
  video.currentTime = 0;

  if (!isDisplayEnabled.value) {
    video.muted = true;
    video.play().then(() => {
      playbackNotice.value = 'CEREMONY STARTED MUTED. CLICK ENABLE CEREMONY TO UNMUTE.';
    }).catch(() => {
      playbackNotice.value = 'VIDEO PLAYBACK BLOCKED: CLICK ENABLE CEREMONY ON THE MAIN DISPLAY';
    });
    return;
  }

  video.muted = false;
  video.play().catch(() => {
    playbackNotice.value = 'VIDEO PLAYBACK BLOCKED: ENABLE CEREMONY ON THE MAIN DISPLAY';
  });
};

const { status: webSocketStatus } = useWebSocket(handlePlayVideo);

const startAuthentication = () => {
  cyberAudio.playInitiation();
  state.value = 'authenticating';
  logs.value = [];

  setTimeout(() => {
    cyberAudio.playClick();
    logs.value.push('INITIALIZING SECURE CHANNEL...');
  }, 400);

  setTimeout(() => {
    cyberAudio.playClick();
    logs.value.push('GENERATING AUTHORIZATION REQUEST...');
  }, 1200);

  setTimeout(() => {
    cyberAudio.playClick();
    logs.value.push('SECURE CHANNEL ESTABLISHED.');
  }, 2000);

  setTimeout(() => {
    cyberAudio.playClick();
    state.value = 'revealed';
  }, 2800);
};
</script>
