<template>
  <div class="relative w-full max-w-2xl mx-auto flex flex-col items-center justify-center min-h-[500px] select-none font-mono text-center overflow-hidden">
    
    <!-- Background Dimmer & Scanning Ring overlay -->
    <div 
      :class="[
        'fixed inset-0 z-10 transition-opacity duration-1000 pointer-events-none',
        currentStep >= 1 ? 'bg-black/90 opacity-100' : 'opacity-0'
      ]"
    />

    <!-- Main Cinematic Stage Container -->
    <div class="relative z-20 flex flex-col items-center justify-center w-full px-4">
      
      <!-- Canvas for Digital Tear Fragments & Particle Assembly -->
      <canvas 
        ref="particleCanvasRef" 
        class="absolute inset-0 w-full h-full pointer-events-none z-30"
      />

      <!-- STEP 1 & STEP 2: QR FREEZE & DIGITAL TEAR (TRANSITION QR.png -> tornqr.png) -->
      <div 
        v-if="currentStep <= 2" 
        :class="[
          'relative transition-all duration-500',
          currentStep === 1 ? 'scale-105 filter brightness-125' : '',
          isTearing ? 'animate-glitch-tear' : ''
        ]"
      >
        <!-- Laser Rip Seam Line overlay during tear transition -->
        <div 
          v-if="isTearing" 
          class="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-1 bg-gradient-to-b from-transparent via-red-500 to-transparent z-40 animate-pulse shadow-[0_0_25px_#ff0033]" 
        />

        <QRCodeRenderer 
          :image-src="currentQrImage"
          :value="qrUrl" 
          :label="currentStep === 1 ? 'AUTHORIZATION GRANTED' : 'CIPHER OVERRIDE // TEARING QR CODE'" 
          :is-scanning="currentStep === 1"
        />

        <!-- Glitch Slices Overlay for Tear -->
        <div v-if="isTearing" class="absolute inset-0 pointer-events-none overflow-hidden z-30">
          <div class="w-full h-1/4 bg-red-600/30 translate-x-4 transition-transform animate-pulse" />
          <div class="w-full h-1/4 bg-red-800/40 -translate-x-5 transition-transform" />
          <div class="w-full h-1/4 bg-red-500/20 translate-x-3 transition-transform animate-pulse" />
        </div>
      </div>

      <!-- STEP 3 & STEP 4: CRIMSON PADLOCK (CLOSED -> OPENING) -->
      <div 
        v-if="currentStep >= 3 && currentStep <= 4" 
        class="relative flex flex-col items-center justify-center my-8 transition-all duration-700 animate-fade-in"
      >
        <!-- Security HUD Circular Ring -->
        <div class="absolute -inset-10 rounded-full border border-red-600/40 border-dashed animate-[spin_10s_linear_infinite]" />
        
        <!-- Lock Container -->
        <div class="relative p-8 rounded-full bg-neutral-950/80 border border-red-600/80 shadow-[0_0_40px_rgba(255,0,50,0.6)] backdrop-blur-md">
          
          <!-- Padlock SVG with Shackle Motion -->
          <svg class="w-24 h-24 text-red-500 drop-shadow-[0_0_15px_rgba(255,0,50,0.8)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <!-- Shackle (Moves up when unlocked) -->
            <path 
              d="M7 11V7a5 5 0 0 1 10 0v4" 
              :class="[
                'transition-transform duration-700 ease-out origin-bottom',
                isUnlocked ? '-translate-y-3.5 rotate-[-12deg]' : ''
              ]"
            />
            <!-- Lock Body -->
            <rect x="5" y="11" width="14" height="10" rx="2" class="fill-red-950/60 stroke-red-500" />
            <circle cx="12" cy="16" r="1" class="fill-red-400" />
          </svg>

        </div>

        <div class="mt-4 text-xs font-bold tracking-[0.3em] uppercase text-red-400">
          {{ isUnlocked ? 'SECURITY CLEARANCE ACCEPTED' : 'SECURITY PROTOCOL ACTIVE' }}
        </div>
      </div>

      <!-- STEP 5: PROTECTIVE SHIELD SYMBOL -->
      <div 
        v-if="currentStep === 5" 
        class="relative flex flex-col items-center justify-center my-8 transition-all duration-500 animate-scale-up"
      >
        <div class="p-8 rounded-full bg-neutral-950/90 border-2 border-red-500 shadow-[0_0_50px_rgba(255,0,50,0.8)]">
          <svg class="w-28 h-28 text-red-500 animate-pulse" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" class="fill-red-950/70" />
            <path d="M12 8v8m-4-4h8" stroke-width="2" stroke-linecap="round" />
          </svg>
        </div>
        <div class="mt-4 text-xs font-bold tracking-[0.3em] uppercase text-red-400">
          SYSTEM SECURED // SHIELD ACTIVE
        </div>
      </div>

      <!-- STEP 6 & STEP 7: LOGO & OFFICIAL INAUGURATION MESSAGE -->
      <div 
        v-if="currentStep >= 6" 
        class="flex flex-col items-center justify-center space-y-6 transition-all duration-1000 animate-fade-in"
      >
        <!-- Assembled Cybersecurity Cell Logo -->
        <div class="relative group">
          <div class="absolute -inset-4 rounded-full bg-red-600/20 blur-xl animate-pulse" />
          
          <div class="relative p-6 rounded-2xl bg-neutral-950 border border-red-600/80 shadow-[0_0_40px_rgba(255,0,50,0.6)] flex items-center justify-center">
            <svg class="w-20 h-20 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </div>
        </div>

        <!-- Major Title: CYBERSECURITY CELL -->
        <div class="space-y-2">
          <h2 class="font-orbitron text-3xl sm:text-5xl font-black tracking-widest text-white uppercase drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]">
            CYBERSECURITY CELL
          </h2>
          
          <!-- STEP 7: OFFICIAL INAUGURATION BANNER -->
          <div v-if="currentStep >= 7" class="space-y-4 pt-2">
            <div class="inline-block px-6 py-2 bg-gradient-to-r from-red-950 via-red-800 to-red-950 border border-red-500/80 rounded text-red-100 font-orbitron text-lg sm:text-xl font-bold tracking-[0.25em] uppercase shadow-[0_0_25px_rgba(255,0,50,0.7)] animate-bounce-subtle">
              OFFICIALLY INAUGURATED
            </div>

            <!-- Supporting Telemetry Info -->
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-lg mx-auto pt-4 text-xs font-mono text-gray-400">
              <div class="bg-neutral-900/80 border border-neutral-800 p-2 rounded">
                STATUS: <strong class="text-emerald-400">ACTIVE</strong>
              </div>
              <div class="bg-neutral-900/80 border border-neutral-800 p-2 rounded">
                AUTHORIZATION: <strong class="text-emerald-400">VERIFIED</strong>
              </div>
              <div class="bg-neutral-900/80 border border-neutral-800 p-2 rounded">
                SECURITY: <strong class="text-emerald-400">ENABLED</strong>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import QRCodeRenderer from './QRCodeRenderer.vue';
import { cyberAudio } from '../utils/cyberAudio';
import qrPng from '../assets/QR.png';
import tornQrPng from '../assets/tornqr.png';

const props = defineProps<{
  qrUrl: string;
}>();

const currentStep = ref(1); // 1: QR Freeze, 2: Tear, 3: Padlock, 4: Unlock, 5: Shield, 6: Logo, 7: Inaugurated
const currentQrImage = ref(qrPng);
const isTearing = ref(false);
const isUnlocked = ref(false);
const particleCanvasRef = ref<HTMLCanvasElement | null>(null);

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
}

let particles: Particle[] = [];
let animFrameId: number | null = null;

const createDisintegrationParticles = () => {
  const canvas = particleCanvasRef.value;
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  canvas.width = canvas.parentElement?.offsetWidth || 600;
  canvas.height = canvas.parentElement?.offsetHeight || 500;

  particles = [];
  const particleCount = 180;
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;

  for (let i = 0; i < particleCount; i++) {
    // Spawning particles concentrated along the central torn seam
    const seamY = centerY + (Math.random() - 0.5) * 280;
    const seamX = centerX + (Math.random() - 0.5) * 20;
    const angle = (Math.random() > 0.5 ? 0 : Math.PI) + (Math.random() - 0.5) * 1.2;
    const speed = 3 + Math.random() * 8;

    particles.push({
      x: seamX,
      y: seamY,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      size: 2 + Math.random() * 5,
      color: Math.random() > 0.25 ? '#ff0033' : '#ffffff',
      alpha: 1
    });
  }
};

const animateParticles = () => {
  const canvas = particleCanvasRef.value;
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  particles.forEach((p) => {
    p.x += p.vx;
    p.y += p.vy;
    p.alpha -= 0.015;

    if (p.alpha > 0) {
      ctx.fillStyle = p.color;
      ctx.globalAlpha = Math.max(0, p.alpha);
      ctx.fillRect(p.x, p.y, p.size, p.size);
    }
  });

  particles = particles.filter((p) => p.alpha > 0);

  if (particles.length > 0) {
    animFrameId = requestAnimationFrame(animateParticles);
  }
};

const startCinematicSequence = () => {
  // STEP 1: Intact QR.png at start
  currentStep.value = 1;
  currentQrImage.value = qrPng;
  cyberAudio.playClick();

  // STEP 2: Transition from QR.png -> tornqr.png (Digital Tear) after 1.5s
  setTimeout(() => {
    currentStep.value = 2;
    isTearing.value = true;
    currentQrImage.value = tornQrPng; // TRANSITION TO tornqr.png!
    cyberAudio.playDigitalTear();
    createDisintegrationParticles();
    animFrameId = requestAnimationFrame(animateParticles);
  }, 1500);

  // STEP 3: Padlock Materialization after 3.2s
  setTimeout(() => {
    currentStep.value = 3;
    isTearing.value = false;
  }, 3200);

  // STEP 4: Lock Unlock after 4.7s
  setTimeout(() => {
    currentStep.value = 4;
    isUnlocked.value = true;
    cyberAudio.playLockUnlock();
  }, 4700);

  // STEP 5: Shield Symbol after 6.2s
  setTimeout(() => {
    currentStep.value = 5;
  }, 6200);

  // STEP 6: Logo Reveal after 7.7s
  setTimeout(() => {
    currentStep.value = 6;
  }, 7700);

  // STEP 7: Official Message after 9.2s
  setTimeout(() => {
    currentStep.value = 7;
    cyberAudio.playInaugurationChime();
  }, 9200);
};

onMounted(() => {
  startCinematicSequence();
});

onUnmounted(() => {
  if (animFrameId) cancelAnimationFrame(animFrameId);
});
</script>

<style scoped>
@keyframes glitchTear {
  0% { transform: translate(0); filter: hue-rotate(0deg); }
  20% { transform: translate(-8px, 4px) skewX(10deg); filter: hue-rotate(90deg); }
  40% { transform: translate(6px, -4px) skewX(-15deg); }
  60% { transform: translate(-4px, 2px); }
  80% { transform: translate(4px, -2px); }
  100% { transform: translate(0); }
}

.animate-glitch-tear {
  animation: glitchTear 0.4s infinite alternate ease-in-out;
}

.animate-fade-in {
  animation: fadeIn 0.8s ease-out forwards;
}

.animate-scale-up {
  animation: scaleUp 0.6s ease-out forwards;
}

.animate-bounce-subtle {
  animation: bounceSubtle 2s infinite ease-in-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes scaleUp {
  from { opacity: 0; transform: scale(0.8); }
  to { opacity: 1; transform: scale(1); }
}

@keyframes bounceSubtle {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-4px); }
}
</style>
