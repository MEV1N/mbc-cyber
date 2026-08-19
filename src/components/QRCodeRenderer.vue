<template>
  <div class="relative flex flex-col items-center justify-center select-none font-mono">
    
    <!-- Raw QR.png Display with exact torn paper edges (No containers, borders, or canvas fallback) -->
    <div class="relative flex items-center justify-center">
      <img 
        :src="imageSrc || qrPng" 
        alt="Scannable QR Code" 
        class="w-72 h-72 sm:w-96 sm:h-96 block object-contain"
      />
    </div>

    <!-- Optional Label -->
    <div v-if="label" class="mt-4 text-xs text-red-400 tracking-[0.2em] uppercase font-bold text-center">
      {{ label }}
    </div>

  </div>
</template>

<script setup lang="ts">
import qrPng from '../assets/QR.png';

withDefaults(defineProps<{
  value?: string;
  imageSrc?: string;
  label?: string;
  isScanning?: boolean;
}>(), {
  label: '',
  isScanning: false
});
</script>
