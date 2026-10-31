import * as THREE from 'three';
import {
  woodTexture, bambooTexture, linenTexture, paperTexture, clothTexture, petalGradientTexture, leafTexture
} from './textures.js';

export function createMaterials() {
  const woodMap = woodTexture({ base: '#4a2a1a', light: '#8d5837', dark: '#1b0e07', planks: 3, repeat: [1.5, 1.5] });
  const lightWoodMap = woodTexture({ base: '#6f4a2c', light: '#b57e4d', dark: '#3a2111', planks: 2, repeat: [1.2, 1] });
  const bambooMap = bambooTexture({});
  const linenMap = linenTexture({ tint: '#e4d8c0' });
  const paperMap = paperTexture({});
  const clothMap = clothTexture({ base: '#3d2419', pattern: '#a34739' });
  const petalMap = petalGradientTexture();
  const leafMap = leafTexture();

  const wood = new THREE.MeshPhysicalMaterial({
    map: woodMap, bumpMap: woodMap, bumpScale: 0.008, color: '#c7a386',
    roughness: 0.46, clearcoat: 0.24, clearcoatRoughness: 0.6
  });
  const woodLight = new THREE.MeshPhysicalMaterial({
    map: lightWoodMap, bumpMap: lightWoodMap, bumpScale: 0.006, color: '#d3b18e',
    roughness: 0.52, clearcoat: 0.18, clearcoatRoughness: 0.7
  });
  const woodDark = new THREE.MeshPhysicalMaterial({
    map: woodMap, color: '#7d5942', roughness: 0.55, clearcoat: 0.15, clearcoatRoughness: 0.75
  });
  const woodPolished = new THREE.MeshPhysicalMaterial({
    map: woodMap, color: '#a77f61', roughness: 0.3, clearcoat: 0.5, clearcoatRoughness: 0.32
  });
  const bamboo = new THREE.MeshPhysicalMaterial({
    map: bambooMap, bumpMap: bambooMap, bumpScale: 0.0035, color: '#f2dfb1',
    roughness: 0.42, clearcoat: 0.3, clearcoatRoughness: 0.5, sheen: 0.28, sheenColor: '#fff0c8'
  });
  const bambooWarm = new THREE.MeshPhysicalMaterial({
    map: bambooMap, color: '#e5c895', roughness: 0.5, clearcoat: 0.2, clearcoatRoughness: 0.6
  });
  const bambooNode = new THREE.MeshStandardMaterial({ color: '#b18d57', roughness: 0.7, bumpMap: bambooMap, bumpScale: 0.002 });
  const bambooGreen = new THREE.MeshPhysicalMaterial({
    map: bambooMap, color: '#a8ad7b', roughness: 0.55, clearcoat: 0.18
  });
  const linen = new THREE.MeshStandardMaterial({ map: linenMap, bumpMap: linenMap, bumpScale: 0.004, color: '#f2e8d6', roughness: 0.92 });
  const paper = new THREE.MeshStandardMaterial({ map: paperMap, color: '#faf3e5', roughness: 0.92, side: THREE.DoubleSide });
  const paperPink = new THREE.MeshPhysicalMaterial({ map: petalMap, color: '#ffffff', roughness: 0.76, side: THREE.DoubleSide, sheen: 0.35, sheenColor: '#ffd7e2' });
  const paperWhite = new THREE.MeshPhysicalMaterial({ map: paperMap, color: '#fffaf0', roughness: 0.84, side: THREE.DoubleSide });
  const cloth = new THREE.MeshStandardMaterial({ map: clothMap, color: '#8a6c59', roughness: 1 });
  const clothRed = new THREE.MeshStandardMaterial({ map: clothMap, color: '#b45d4b', roughness: 1 });
  const ceramicCream = new THREE.MeshPhysicalMaterial({ color: '#e8ddc7', roughness: 0.28, clearcoat: 0.9, clearcoatRoughness: 0.18, ior: 1.45 });
  const ceramicCeladon = new THREE.MeshPhysicalMaterial({ color: '#9fb7a6', roughness: 0.26, clearcoat: 0.95, clearcoatRoughness: 0.16, ior: 1.45 });
  const ceramicDark = new THREE.MeshPhysicalMaterial({ color: '#65503a', roughness: 0.34, clearcoat: 0.6, clearcoatRoughness: 0.3 });
  const ceramicRed = new THREE.MeshPhysicalMaterial({ color: '#9c4437', roughness: 0.3, clearcoat: 0.8, clearcoatRoughness: 0.2 });
  const brass = new THREE.MeshPhysicalMaterial({ color: '#c5a063', metalness: 0.9, roughness: 0.3, clearcoat: 0.2 });
  const bronze = new THREE.MeshPhysicalMaterial({ color: '#82633e', metalness: 0.8, roughness: 0.44 });
  const iron = new THREE.MeshPhysicalMaterial({ color: '#5b5a56', metalness: 0.72, roughness: 0.48 });
  const steel = new THREE.MeshPhysicalMaterial({ color: '#a8a6a0', metalness: 0.92, roughness: 0.26 });
  const copper = new THREE.MeshPhysicalMaterial({ color: '#b87246', metalness: 0.85, roughness: 0.33 });
  const wire = new THREE.MeshPhysicalMaterial({ color: '#8d8c88', metalness: 0.82, roughness: 0.36 });
  const twine = new THREE.MeshStandardMaterial({ color: '#efe6d3', roughness: 1 });
  const cord = new THREE.MeshStandardMaterial({ color: '#e9ddc5', roughness: 0.94 });
  const cotton = new THREE.MeshStandardMaterial({ color: '#f5eee0', roughness: 1 });
  const petal = new THREE.MeshPhysicalMaterial({ map: petalMap, color: '#ffffff', roughness: 0.75, side: THREE.DoubleSide, sheen: 0.3, sheenColor: '#ffe4ec', bumpMap: petalMap, bumpScale: .00018 });
  const petalDeep = new THREE.MeshPhysicalMaterial({ map: petalMap, color: '#f3bdcc', roughness: 0.64, side: THREE.DoubleSide, sheen: 0.5, sheenColor: '#ffd9e3' });
  const leaf = new THREE.MeshPhysicalMaterial({ map: leafMap, color: '#e9f0dc', roughness: 0.62, side: THREE.DoubleSide, sheen: 0.35, sheenColor: '#d9efcf' });
  const leafBack = new THREE.MeshPhysicalMaterial({ map: leafMap, color: '#d4ddc7', roughness: 0.7, side: THREE.DoubleSide });
  const flowerPink = new THREE.MeshPhysicalMaterial({ map: petalMap, color: '#fff2fa', roughness: 0.68, side: THREE.DoubleSide, bumpMap: petalMap, bumpScale: .00015, sheen: 0.35, sheenColor: '#ffe7ef' });
  const flowerCore = new THREE.MeshStandardMaterial({ color: '#d7b061', roughness: 0.75 });
  const stem = new THREE.MeshPhysicalMaterial({ color: '#4b6d3f', roughness: 0.7, clearcoat: 0.2 });
  const paste = new THREE.MeshPhysicalMaterial({ color: '#f2ead4', roughness: 0.52, clearcoat: 0.3 });
  const pasteDry = new THREE.MeshStandardMaterial({ color: '#d8c9a4', roughness: 0.9 });
  const dyePink = new THREE.MeshPhysicalMaterial({ color: '#c26f92', roughness: 0.18, clearcoat: 0.8, transparent: true, opacity: 0.9 });
  const dyeGreen = new THREE.MeshPhysicalMaterial({ color: '#63845a', roughness: 0.22, clearcoat: 0.7, transparent: true, opacity: 0.9 });
  const water = new THREE.MeshPhysicalMaterial({ color: '#8fa999', roughness: 0.1, clearcoat: 1, transparent: true, opacity: 0.72 });
  const ink = new THREE.MeshStandardMaterial({ color: '#22160f', roughness: 0.5 });
  const blackLacquer = new THREE.MeshPhysicalMaterial({ color: '#1b110b', roughness: 0.28, clearcoat: 0.75, clearcoatRoughness: 0.22 });
  const glowPaper = new THREE.MeshStandardMaterial({ color: '#ffe4b5', emissive: '#ffc077', emissiveIntensity: 1.2, roughness: 0.8 });
  const candleWax = new THREE.MeshPhysicalMaterial({ color: '#f7e8c8', roughness: 0.5, clearcoat: 0.2 });
  const redLacquer = new THREE.MeshPhysicalMaterial({ color: '#7e201c', roughness: 0.36, clearcoat: 0.6 });
  const redThread = new THREE.MeshStandardMaterial({ color: '#c52c30', roughness: .95, bumpMap: linenMap, bumpScale: .00012 });
  const gold = new THREE.MeshPhysicalMaterial({ color: '#d9b26f', metalness: 0.82, roughness: 0.3 });

  return {
    wood, woodLight, woodDark, woodPolished, bamboo, bambooWarm, bambooNode, bambooGreen,
    linen, paper, paperPink, paperWhite, cloth, clothRed,
    ceramicCream, ceramicCeladon, ceramicDark, ceramicRed,
    brass, bronze, iron, steel, copper, wire,
    twine, cord, cotton, petal, petalDeep, leaf, leafBack, flowerPink, flowerCore, stem,
    paste, pasteDry, dyePink, dyeGreen, water, ink, blackLacquer, glowPaper, candleWax, redLacquer, redThread, gold,
    textures: { woodMap, lightWoodMap, bambooMap, linenMap, paperMap, clothMap, petalMap, leafMap }
  };
}
