/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { soundEngine } from '../engine/sound.ts';

interface NeoHeroVisualProps {
  reducedMotion?: boolean;
}

interface OrbitingSphereConfig {
  mesh: THREE.Mesh;
  orbitRadius: number;
  orbitSpeed: number;
  inclinationX: number;
  inclinationZ: number;
  phase: number;
  yBase: number;
}

/**
 * Procedural Organic Twisted Torus Geometry with 3-fold aerodynamic helical ridges
 */
function createOrganicTwistedTorusGeometry(): THREE.BufferGeometry {
  const radius = 1.78;
  const tube = 0.62;
  const radialSegments = 54;
  const tubularSegments = 160;

  const geo = new THREE.TorusGeometry(radius, tube, radialSegments, tubularSegments);
  const pos = geo.attributes.position;
  const vertex = new THREE.Vector3();

  for (let i = 0; i < pos.count; i++) {
    vertex.fromBufferAttribute(pos, i);

    // Calculate angle in the main torus plane (XY)
    const angleU = Math.atan2(vertex.y, vertex.x);
    const centerDist = Math.sqrt(vertex.x * vertex.x + vertex.y * vertex.y);
    const angleV = Math.atan2(vertex.z, centerDist - radius);

    // 3-fold helical rib twist and flowing organic wave
    const twist = Math.sin(angleU * 3.0 + angleV * 1.5) * 0.085;
    const flow = Math.cos(angleU * 5.0) * 0.035;

    // Normal vector pointing outwards from the tube center
    const normalX = (centerDist - radius) * (vertex.x / centerDist);
    const normalY = (centerDist - radius) * (vertex.y / centerDist);
    const normalZ = vertex.z;
    const len = Math.sqrt(normalX * normalX + normalY * normalY + normalZ * normalZ) || 1;

    vertex.x += (normalX / len) * (twist + flow);
    vertex.y += (normalY / len) * (twist + flow);
    vertex.z += (normalZ / len) * (twist + flow);

    pos.setXYZ(i, vertex.x, vertex.y, vertex.z);
  }

  geo.computeVertexNormals();
  return geo;
}

/**
 * Creates high-resolution procedural texture for the mechanical keycap dish
 * featuring crisp white letter "T" with subtle neon bloom and cybernetic micro-markings.
 */
function createKeycapLetterTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    ctx.clearRect(0, 0, 512, 512);

    // Translucent rounded dish border
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
    ctx.lineWidth = 12;
    ctx.beginPath();
    ctx.roundRect(44, 44, 424, 424, 60);
    ctx.stroke();

    // Subtle radial dish gradient
    const radial = ctx.createRadialGradient(256, 200, 20, 256, 256, 240);
    radial.addColorStop(0, 'rgba(255, 255, 255, 0.28)');
    radial.addColorStop(0.45, 'rgba(168, 85, 247, 0.18)');
    radial.addColorStop(0.85, 'rgba(91, 140, 255, 0.08)');
    radial.addColorStop(1, 'rgba(13, 11, 29, 0.0)');
    ctx.fillStyle = radial;
    ctx.beginPath();
    ctx.roundRect(44, 44, 424, 424, 60);
    ctx.fill();

    // Top rim specular reflection line
    const topGlow = ctx.createLinearGradient(90, 48, 422, 48);
    topGlow.addColorStop(0, 'rgba(255, 255, 255, 0.0)');
    topGlow.addColorStop(0.5, 'rgba(255, 255, 255, 0.95)');
    topGlow.addColorStop(1, 'rgba(255, 255, 255, 0.0)');
    ctx.strokeStyle = topGlow;
    ctx.lineWidth = 10;
    ctx.beginPath();
    ctx.moveTo(90, 50);
    ctx.lineTo(422, 50);
    ctx.stroke();

    // Corner crosshair micro-markings
    ctx.strokeStyle = 'rgba(91, 140, 255, 0.5)';
    ctx.lineWidth = 2;
    // Top-left
    ctx.beginPath();
    ctx.moveTo(68, 78);
    ctx.lineTo(68, 68);
    ctx.lineTo(78, 68);
    ctx.stroke();
    // Bottom-right
    ctx.beginPath();
    ctx.moveTo(444, 434);
    ctx.lineTo(444, 444);
    ctx.lineTo(434, 444);
    ctx.stroke();

    // Bold crisp white letter "T"
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = "900 240px 'Space Grotesk', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";

    // Ambient glow shadow
    ctx.shadowColor = 'rgba(255, 255, 255, 0.95)';
    ctx.shadowBlur = 36;
    ctx.fillStyle = '#ffffff';
    ctx.fillText('T', 256, 268);

    // Core layer
    ctx.shadowBlur = 8;
    ctx.fillStyle = '#ffffff';
    ctx.fillText('T', 256, 268);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.generateMipmaps = true;
  return texture;
}

/**
 * Procedural extruded 3D mechanical keycap geometry with beveled chamfers
 */
function createKeycapGeometry(): THREE.BufferGeometry {
  const shape = new THREE.Shape();
  const size = 1.35;
  const radius = 0.22;
  const half = size / 2;

  shape.moveTo(-half + radius, -half);
  shape.lineTo(half - radius, -half);
  shape.quadraticCurveTo(half, -half, half, -half + radius);
  shape.lineTo(half, half - radius);
  shape.quadraticCurveTo(half, half, half - radius, half);
  shape.lineTo(-half + radius, half);
  shape.quadraticCurveTo(-half, half, -half, half - radius);
  shape.lineTo(-half, -half + radius);
  shape.quadraticCurveTo(-half, -half, -half + radius, -half);

  const extrudeSettings: THREE.ExtrudeGeometryOptions = {
    steps: 2,
    depth: 0.46,
    bevelEnabled: true,
    bevelThickness: 0.12,
    bevelSize: 0.1,
    bevelOffset: 0,
    bevelSegments: 6,
  };

  const geo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
  geo.center();
  return geo;
}

export const NeoHeroVisual: React.FC<NeoHeroVisualProps> = ({ reducedMotion = false }) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [isPressingKey, setIsPressingKey] = useState(false);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // Detect software WebGL
    const isSoftwareGl = (() => {
      try {
        const gl = document.createElement('canvas').getContext('webgl2');
        if (!gl) return true;
        const ext = gl.getExtension('WEBGL_debug_renderer_info');
        const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
        const gpu = String(gl.getParameter(param));
        gl.getExtension('WEBGL_lose_context')?.loseContext();
        return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
      } catch {
        return false;
      }
    })();

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: !isSoftwareGl,
        powerPreference: 'high-performance',
      });
    } catch {
      return;
    }

    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));

    const width = mount.clientWidth || 460;
    const height = mount.clientHeight || 460;
    renderer.setSize(width, height);
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.display = 'block';
    mount.appendChild(renderer.domElement);

    // Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0, 7.0);

    // Studio Environment Map for physically accurate iridescent specular reflections
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // Studio Lighting Rig
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    // Key Light: Electric Cyan/Blue specular highlights
    const keyLight = new THREE.DirectionalLight(0x5b8cff, 2.8);
    keyLight.position.set(4.5, 3.5, 5);
    scene.add(keyLight);

    // Rim Light: Vivid Magenta/Purple iridescent edge reflection
    const rimLight = new THREE.DirectionalLight(0xd946ef, 2.5);
    rimLight.position.set(-4.5, -2.8, 4.2);
    scene.add(rimLight);

    // Golden Amber backlight matching top reflections
    const topLight = new THREE.DirectionalLight(0xf59e0b, 2.2);
    topLight.position.set(0.5, 5.2, -2.5);
    scene.add(topLight);

    // Point Light near keycap for internal refraction
    const keycapLight = new THREE.PointLight(0xa855f7, 2.2, 4);
    keycapLight.position.set(0, 0.2, 1.8);
    scene.add(keycapLight);

    // Root Group for interactive rotation & parallax
    const heroGroup = new THREE.Group();
    scene.add(heroGroup);

    const disposables: { dispose: () => void }[] = [];

    // 1. PROCEDURAL ORGANIC TWISTED TORUS RING (Deep Iridescent Liquid Titanium)
    const torusGeo = createOrganicTwistedTorusGeometry();
    disposables.push(torusGeo);

    const torusMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(0x384166), // Deep blue-violet base
      metalness: 0.94,
      roughness: 0.11,
      clearcoat: 1.0,
      clearcoatRoughness: 0.04,
      reflectivity: 0.98,
      iridescence: 1.0, // Physical thin-film interference creates real optical rainbow shimmer
      iridescenceIOR: 1.45,
      iridescenceThicknessRange: [120, 580],
      side: THREE.DoubleSide,
    });
    disposables.push(torusMat);

    const torusMesh = new THREE.Mesh(torusGeo, torusMat);
    torusMesh.rotation.set(-0.25, 0.35, 0.15);
    heroGroup.add(torusMesh);

    // 2. SECONDARY NESTED COUNTER-ROTATING CRYSTALLINE GLASS BAND
    const innerRibbonGeo = new THREE.TorusKnotGeometry(1.35, 0.09, 140, 24, 2, 3);
    disposables.push(innerRibbonGeo);

    const innerRibbonMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(0xdbeafe),
      metalness: 0.15,
      roughness: 0.06,
      transmission: isSoftwareGl ? 0 : 0.88,
      transparent: true,
      opacity: 1,
      ior: 1.62,
      thickness: 0.8,
      attenuationColor: new THREE.Color(0x818cf8),
      attenuationDistance: 1.8,
      clearcoat: 1.0,
      clearcoatRoughness: 0.02,
    });
    disposables.push(innerRibbonMat);

    const innerRibbonMesh = new THREE.Mesh(innerRibbonGeo, innerRibbonMat);
    innerRibbonMesh.rotation.set(0.6, -0.4, 0.8);
    heroGroup.add(innerRibbonMesh);

    // 3. FLOATING MECHANICAL GLASS KEYCAP ("T")
    const keycapGroup = new THREE.Group();
    heroGroup.add(keycapGroup);

    const keycapGeo = createKeycapGeometry();
    disposables.push(keycapGeo);

    const keycapMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(0xffffff),
      transmission: isSoftwareGl ? 0 : 0.86,
      opacity: 1,
      transparent: true,
      roughness: 0.08,
      metalness: 0.08,
      ior: 1.54,
      thickness: 1.4,
      attenuationColor: new THREE.Color(0xa855f7),
      attenuationDistance: 1.6,
      clearcoat: 1.0,
      clearcoatRoughness: 0.03,
      reflectivity: 0.95,
      side: THREE.DoubleSide,
    });
    disposables.push(keycapMat);

    const keycapMesh = new THREE.Mesh(keycapGeo, keycapMat);
    keycapGroup.add(keycapMesh);

    // Visible internal mechanical switch cross stem (+) inside the clear keycap
    const stemGroup = new THREE.Group();
    const stemMat = new THREE.MeshStandardMaterial({
      color: 0x5b8cff,
      roughness: 0.25,
      metalness: 0.7,
      emissive: 0x2244aa,
      emissiveIntensity: 0.4,
    });
    disposables.push(stemMat);

    const stemBar1Geo = new THREE.BoxGeometry(0.5, 0.14, 0.32);
    const stemBar2Geo = new THREE.BoxGeometry(0.14, 0.5, 0.32);
    disposables.push(stemBar1Geo, stemBar2Geo);

    const stemBar1 = new THREE.Mesh(stemBar1Geo, stemMat);
    const stemBar2 = new THREE.Mesh(stemBar2Geo, stemMat);
    stemGroup.add(stemBar1);
    stemGroup.add(stemBar2);
    stemGroup.position.set(0, 0, -0.05);
    keycapGroup.add(stemGroup);

    // Crisp white letter "T" decal on top face
    const letterTexture = createKeycapLetterTexture();
    disposables.push(letterTexture);

    const letterGeo = new THREE.PlaneGeometry(1.35, 1.35);
    disposables.push(letterGeo);

    const letterMat = new THREE.MeshBasicMaterial({
      map: letterTexture,
      transparent: true,
      depthWrite: false,
      polygonOffset: true,
      polygonOffsetFactor: -2,
      polygonOffsetUnits: -2,
      side: THREE.DoubleSide,
    });
    disposables.push(letterMat);

    const letterMesh = new THREE.Mesh(letterGeo, letterMat);
    letterMesh.position.set(0, 0, 0.36);
    keycapGroup.add(letterMesh);

    // Base position & orientation of the keycap
    const baseKeycapPos = new THREE.Vector3(0.02, 0.06, 1.18);
    const baseKeycapRot = new THREE.Euler(-0.16, 0.22, -0.14);
    keycapGroup.position.copy(baseKeycapPos);
    keycapGroup.rotation.copy(baseKeycapRot);

    // 4. SUBTLE ORBITAL LUMINESCENT RINGS
    const orbitGeo1 = new THREE.TorusGeometry(2.38, 0.016, 16, 140);
    disposables.push(orbitGeo1);
    const orbitMat1 = new THREE.MeshBasicMaterial({
      color: 0x93c5fd,
      transparent: true,
      opacity: 0.6,
      depthWrite: false,
    });
    disposables.push(orbitMat1);
    const orbitMesh1 = new THREE.Mesh(orbitGeo1, orbitMat1);
    orbitMesh1.rotation.set(1.15, 0.4, 0.2);
    heroGroup.add(orbitMesh1);

    const orbitGeo2 = new THREE.TorusGeometry(2.15, 0.012, 16, 140);
    disposables.push(orbitGeo2);
    const orbitMat2 = new THREE.MeshBasicMaterial({
      color: 0xc084fc,
      transparent: true,
      opacity: 0.5,
      depthWrite: false,
    });
    disposables.push(orbitMat2);
    const orbitMesh2 = new THREE.Mesh(orbitGeo2, orbitMat2);
    orbitMesh2.rotation.set(-0.85, -0.65, 0.4);
    heroGroup.add(orbitMesh2);

    // 5. FLOATING ORBITAL SPHERES
    const orbitingSpheres: OrbitingSphereConfig[] = [];
    const sphereDefs = [
      { radius: 0.14, color: 0x38bdf8, orbit: 2.38, speed: 0.75, inclX: 1.15, inclZ: 0.2, phase: 0.2, yBase: 0 },
      { radius: 0.11, color: 0xd946ef, orbit: 2.15, speed: -0.65, inclX: -0.85, inclZ: 0.4, phase: 2.1, yBase: 0.2 },
      { radius: 0.09, color: 0xfbbf24, orbit: 2.5, speed: 0.45, inclX: 0.5, inclZ: -0.8, phase: 4.2, yBase: -0.3 },
      { radius: 0.07, color: 0xc084fc, orbit: 1.85, speed: 0.95, inclX: 0.3, inclZ: 0.9, phase: 1.2, yBase: 0.1 },
      { radius: 0.05, color: 0xffffff, orbit: 2.25, speed: -0.55, inclX: 1.4, inclZ: -0.3, phase: 3.5, yBase: -0.1 },
    ];

    sphereDefs.forEach((def) => {
      const geo = new THREE.SphereGeometry(def.radius, 32, 32);
      disposables.push(geo);

      const mat = new THREE.MeshPhysicalMaterial({
        color: def.color,
        roughness: 0.08,
        metalness: 0.88,
        clearcoat: 1.0,
        clearcoatRoughness: 0.04,
        iridescence: 0.8,
        iridescenceIOR: 1.35,
        transmission: isSoftwareGl ? 0 : 0.45,
        transparent: true,
      });
      disposables.push(mat);

      const mesh = new THREE.Mesh(geo, mat);
      heroGroup.add(mesh);

      orbitingSpheres.push({
        mesh,
        orbitRadius: def.orbit,
        orbitSpeed: def.speed,
        inclinationX: def.inclX,
        inclinationZ: def.inclZ,
        phase: def.phase,
        yBase: def.yBase,
      });
    });

    // 6. AMBIENT STELLAR PARTICLES DUST
    const particleCount = 45;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    for (let p = 0; p < particleCount; p++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const dist = 2.2 + Math.random() * 1.5;
      particlePositions[p * 3] = dist * Math.sin(phi) * Math.cos(theta);
      particlePositions[p * 3 + 1] = dist * Math.sin(phi) * Math.sin(theta);
      particlePositions[p * 3 + 2] = dist * Math.cos(phi);
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    disposables.push(particleGeo);

    const particleMat = new THREE.PointsMaterial({
      color: 0xc4b5fd,
      size: 0.035,
      transparent: true,
      opacity: 0.65,
      depthWrite: false,
    });
    disposables.push(particleMat);

    const particleSystem = new THREE.Points(particleGeo, particleMat);
    heroGroup.add(particleSystem);

    // Interactive Drag / Mouse Orbit Controls
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    let isDragging = false;
    let prevPointerX = 0;
    let prevPointerY = 0;
    let dragVelocityX = 0;
    let dragVelocityY = 0;

    const handlePointerDown = (e: PointerEvent) => {
      isDragging = true;
      prevPointerX = e.clientX;
      prevPointerY = e.clientY;
    };

    const handlePointerMove = (e: MouseEvent) => {
      if (isDragging) {
        const deltaX = (e.clientX - prevPointerX) * 0.008;
        const deltaY = (e.clientY - prevPointerY) * 0.008;
        dragVelocityX = deltaX;
        dragVelocityY = deltaY;
        heroGroup.rotation.y += deltaX;
        heroGroup.rotation.x += deltaY;
        prevPointerX = e.clientX;
        prevPointerY = e.clientY;
      } else {
        const rect = mount.getBoundingClientRect();
        const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        const ny = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
        mouse.targetX = Math.max(-1, Math.min(1, nx)) * 0.32;
        mouse.targetY = Math.max(-1, Math.min(1, ny)) * 0.28;
      }
    };

    const handlePointerUp = () => {
      isDragging = false;
    };

    const handlePointerLeave = () => {
      isDragging = false;
      mouse.targetX = 0;
      mouse.targetY = 0;
    };

    mount.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    mount.addEventListener('pointerleave', handlePointerLeave);

    // Responsive Canvas Resize
    const handleResize = () => {
      if (!mount) return;
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      if (w <= 0 || h <= 0) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    const ro = new ResizeObserver(handleResize);
    ro.observe(mount);

    // Keypress click trigger on keycap
    let keyDepression = 0;
    const triggerKeyPress = () => {
      keyDepression = 1.0;
      soundEngine.playKeypress('mechanical', 0.5);
      setIsPressingKey(true);
      setTimeout(() => setIsPressingKey(false), 240);
    };

    mount.addEventListener('click', triggerKeyPress);

    // Animation Loop
    let frameId = 0;
    const clock = new THREE.Clock();

    const animate = () => {
      const elapsed = clock.getElapsedTime();
      const motionScale = reducedMotion ? 0.05 : 1.0;

      // Inertial drag momentum or smooth mouse parallax
      if (!isDragging) {
        dragVelocityX *= 0.95;
        dragVelocityY *= 0.95;
        heroGroup.rotation.y += dragVelocityX;
        heroGroup.rotation.x += dragVelocityY;

        mouse.x += (mouse.targetX - mouse.x) * 0.05;
        mouse.y += (mouse.targetY - mouse.y) * 0.05;

        // Auto-rotation when not actively dragged
        heroGroup.rotation.y += 0.004 * motionScale;
      }

      // Continuous organic rotation of the twisted torus
      torusMesh.rotation.z = Math.sin(elapsed * 0.45 * motionScale) * 0.2 + elapsed * 0.08 * motionScale;

      // Counter-rotation of the inner ribbon
      innerRibbonMesh.rotation.y = elapsed * 0.25 * motionScale;
      innerRibbonMesh.rotation.x = -elapsed * 0.18 * motionScale;

      // Keycap mechanical depression and floating kinematics
      keyDepression *= 0.88;
      const depressionOffset = keyDepression * 0.18;

      keycapGroup.position.y = baseKeycapPos.y + Math.sin(elapsed * 1.6 * motionScale) * 0.06;
      keycapGroup.position.z = baseKeycapPos.z - depressionOffset;
      keycapGroup.rotation.z = baseKeycapRot.z + Math.cos(elapsed * 1.3 * motionScale) * 0.025;
      keycapGroup.rotation.x = baseKeycapRot.x + Math.sin(elapsed * 1.4 * motionScale) * 0.02;

      // Orbiting Spheres motion along 3D inclined paths
      orbitingSpheres.forEach((sphere) => {
        const angle = elapsed * sphere.orbitSpeed * motionScale + sphere.phase;
        const x = Math.cos(angle) * sphere.orbitRadius;
        const z = Math.sin(angle) * sphere.orbitRadius;
        const y = Math.sin(angle * 1.6) * 0.48 + sphere.yBase;

        const pos = new THREE.Vector3(x, y, z);
        pos.applyAxisAngle(new THREE.Vector3(1, 0, 0), sphere.inclinationX);
        pos.applyAxisAngle(new THREE.Vector3(0, 0, 1), sphere.inclinationZ);
        sphere.mesh.position.copy(pos);
      });

      // Slowly rotate orbital guides
      orbitMesh1.rotation.z = elapsed * 0.16 * motionScale;
      orbitMesh2.rotation.z = -elapsed * 0.12 * motionScale;

      // Slowly rotate particle dust
      particleSystem.rotation.y = elapsed * 0.04 * motionScale;

      renderer.render(scene, camera);
      frameId = requestAnimationFrame(animate);
    };

    frameId = requestAnimationFrame(animate);

    // Cleanup on unmount
    return () => {
      cancelAnimationFrame(frameId);
      mount.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      mount.removeEventListener('pointerleave', handlePointerLeave);
      mount.removeEventListener('click', triggerKeyPress);
      ro.disconnect();

      disposables.forEach((item) => {
        try {
          item.dispose();
        } catch {
          // Ignore dispose errors on unmount
        }
      });

      try {
        renderer.dispose();
        if (renderer.domElement && mount.contains(renderer.domElement)) {
          mount.removeChild(renderer.domElement);
        }
      } catch {
        // Ignore unmount DOM errors
      }
    };
  }, [reducedMotion]);

  return (
    <div className="relative w-full max-w-[480px] aspect-square flex items-center justify-center select-none group">
      {/* Soft Ambient Dynamic Radial Aura */}
      <div className="absolute inset-0 bg-gradient-to-tr from-[#a855f7]/25 via-[#5b8cff]/20 to-transparent rounded-full blur-3xl pointer-events-none transition-transform duration-700 group-hover:scale-105" />

      {/* Decorative vertical typographic badge */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 flex flex-col items-center text-[10px] tracking-[0.25em] text-slate-400 font-medium font-sans leading-relaxed pointer-events-none z-20">
        <span className="opacity-70">BETTER</span>
        <span className="opacity-70">TYPING</span>
        <span className="opacity-70">BUILDS A</span>
        <span className="opacity-70">SHARPER</span>
        <span className="opacity-95 text-white font-semibold">YOU</span>
        <span className="w-5 h-[1px] bg-slate-600 my-2" />
      </div>

      {/* Interactive Drag & Click Hint Pill */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-20 px-3 py-1 rounded-full bg-slate-950/70 border border-slate-800/80 backdrop-blur-md text-[10px] text-slate-400 font-mono tracking-wider opacity-60 group-hover:opacity-100 transition-opacity pointer-events-none flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-[#5b8cff] animate-ping" />
        <span>Drag to rotate • Click keycap</span>
      </div>

      {/* Primary Three.js 3D Viewport */}
      <div
        ref={mountRef}
        className="relative z-10 w-full h-full flex items-center justify-center overflow-visible cursor-grab active:cursor-grabbing"
      />
    </div>
  );
};
