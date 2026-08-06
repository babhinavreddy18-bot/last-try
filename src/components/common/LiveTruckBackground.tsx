import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

// Major Indian Logistics Hub Coordinates (Lat, Lng)
const HUBS = [
  { name: 'Mumbai Port', lat: 18.96, lng: 72.82, color: 0x3b82f6 },
  { name: 'Delhi NCR', lat: 28.61, lng: 77.20, color: 0x8b5cf6 },
  { name: 'Bengaluru Hub', lat: 12.97, lng: 77.59, color: 0x06b6d4 },
  { name: 'Hyderabad Node', lat: 17.38, lng: 78.48, color: 0x10b981 },
  { name: 'Chennai Dock', lat: 13.08, lng: 80.27, color: 0xf59e0b },
  { name: 'Kolkata Gateway', lat: 22.57, lng: 88.36, color: 0xec4899 },
  { name: 'Pune Corridor', lat: 18.52, lng: 73.85, color: 0x6366f1 },
];

// Convert Lat/Lng on a sphere of radius R to 3D Vector3 coordinates
function latLngToVector3(lat: number, lng: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);
  return new THREE.Vector3(x, y, z);
}

// Generate a 3D arc curve between two 3D points above the sphere surface
function create3DArcCurve(p1: THREE.Vector3, p2: THREE.Vector3, maxHeightFraction = 0.3): THREE.CubicBezierCurve3 {
  const distance = p1.distanceTo(p2);
  const mid = p1.clone().add(p2).multiplyScalar(0.5);
  const midLength = mid.length();
  
  // Lift control points outwards proportional to distance
  const altitude = midLength + distance * maxHeightFraction;
  
  const control1 = p1.clone().lerp(mid, 0.45).normalize().multiplyScalar(altitude);
  const control2 = p2.clone().lerp(mid, 0.45).normalize().multiplyScalar(altitude);
  
  return new THREE.CubicBezierCurve3(p1, control1, control2, p2);
}

export const LiveTruckBackground: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = window.innerWidth;
    const height = window.innerHeight;

    // ── 1. Scene, Camera, Renderer ────────────────────────────────
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 15, 45);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // ── 2. Lights ─────────────────────────────────────────────────
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0x3b82f6, 1.5);
    dirLight1.position.set(20, 20, 20);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x8b5cf6, 1.2);
    dirLight2.position.set(-20, -10, -20);
    scene.add(dirLight2);

    // ── 3. 3D Globe Group ─────────────────────────────────────────
    const globeGroup = new THREE.Group();
    scene.add(globeGroup);

    const sphereRadius = 14;

    // Core Globe Sphere (Glassy Translucent Surface)
    const isDark = document.documentElement.classList.contains('dark');
    const globeGeo = new THREE.SphereGeometry(sphereRadius, 64, 64);
    const globeMat = new THREE.MeshPhongMaterial({
      color: isDark ? 0x0b1329 : 0xe2e8f0,
      emissive: isDark ? 0x030712 : 0xf1f5f9,
      transparent: true,
      opacity: isDark ? 0.85 : 0.65,
      shininess: 40,
      wireframe: false,
    });
    const globeMesh = new THREE.Mesh(globeGeo, globeMat);
    globeGroup.add(globeMesh);

    // Wireframe Grid Overlay for High-Tech Logistics Feel
    const wireframeGeo = new THREE.SphereGeometry(sphereRadius + 0.05, 36, 18);
    const wireframeMat = new THREE.MeshBasicMaterial({
      color: isDark ? 0x6366f1 : 0x2563eb,
      wireframe: true,
      transparent: true,
      opacity: isDark ? 0.12 : 0.08,
    });
    const wireframeMesh = new THREE.Mesh(wireframeGeo, wireframeMat);
    globeGroup.add(wireframeMesh);

    // Outer Glow Atmosphere Ring
    const atmosphereGeo = new THREE.SphereGeometry(sphereRadius + 1.2, 32, 32);
    const atmosphereMat = new THREE.MeshBasicMaterial({
      color: isDark ? 0x3b82f6 : 0x0d9488,
      transparent: true,
      opacity: isDark ? 0.08 : 0.04,
      side: THREE.BackSide,
    });
    const atmosphereMesh = new THREE.Mesh(atmosphereGeo, atmosphereMat);
    globeGroup.add(atmosphereMesh);

    // ── 4. 3D Logistics Hub Markers & Arcs ───────────────────────
    const hubPoints: THREE.Vector3[] = [];
    HUBS.forEach((hub) => {
      const pos = latLngToVector3(hub.lat, hub.lng, sphereRadius + 0.1);
      hubPoints.push(pos);

      // Node Ring Marker
      const ringGeo = new THREE.RingGeometry(0.2, 0.4, 16);
      const ringMat = new THREE.MeshBasicMaterial({
        color: hub.color,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.8,
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.position.copy(pos);
      ringMesh.lookAt(new THREE.Vector3(0, 0, 0));
      globeGroup.add(ringMesh);

      // Node Glowing Center Core
      const coreGeo = new THREE.SphereGeometry(0.2, 16, 16);
      const coreMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
      const coreMesh = new THREE.Mesh(coreGeo, coreMat);
      coreMesh.position.copy(pos);
      globeGroup.add(coreMesh);
    });

    // Create 3D Arc Highways Connecting Logistics Hubs
    const arcPulses: { mesh: THREE.Mesh; curve: THREE.CubicBezierCurve3; progress: number; speed: number }[] = [];
    
    for (let i = 0; i < hubPoints.length; i++) {
      const nextIndex = (i + 1) % hubPoints.length;
      const p1 = hubPoints[i];
      const p2 = hubPoints[nextIndex];
      const curve = create3DArcCurve(p1, p2, 0.35);

      const points = curve.getPoints(50);
      const arcGeo = new THREE.BufferGeometry().setFromPoints(points);
      const arcMat = new THREE.LineBasicMaterial({
        color: HUBS[i].color,
        transparent: true,
        opacity: isDark ? 0.35 : 0.2,
        linewidth: 2,
      });
      const arcLine = new THREE.Line(arcGeo, arcMat);
      globeGroup.add(arcLine);

      // Glowing 3D Moving Energy Pulse Pod on Curve
      const pulseGeo = new THREE.SphereGeometry(0.28, 16, 16);
      const pulseMat = new THREE.MeshBasicMaterial({
        color: HUBS[i].color,
        transparent: true,
        opacity: 0.9,
      });
      const pulseMesh = new THREE.Mesh(pulseGeo, pulseMat);
      globeGroup.add(pulseMesh);

      arcPulses.push({
        mesh: pulseMesh,
        curve: curve,
        progress: Math.random(),
        speed: 0.15 + Math.random() * 0.15,
      });
    }

    // ── 5. 3D Floating Particle Atmosphere ────────────────────────
    const particleCount = 600;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 120;
      particlePositions[i + 1] = (Math.random() - 0.5) * 120;
      particlePositions[i + 2] = (Math.random() - 0.5) * 120;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      size: 0.6,
      color: isDark ? 0x818cf8 : 0x2563eb,
      transparent: true,
      opacity: isDark ? 0.45 : 0.25,
    });
    const particleSystem = new THREE.Points(particleGeo, particleMat);
    scene.add(particleSystem);

    // Initial globe rotation alignment towards India
    globeGroup.rotation.y = Math.PI * 0.65;
    globeGroup.rotation.x = 0.2;

    // ── 6. Mouse Interaction & Resize Listeners ────────────────────
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseRef.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };

    const handleResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);

    // ── 7. Animation Loop ──────────────────────────────────────────
    let clock = new THREE.Clock();

    const animate = () => {
      requestAnimationFrame(animate);
      const delta = clock.getDelta();

      // Smooth Globe Rotation
      globeGroup.rotation.y += delta * 0.08;
      particleSystem.rotation.y += delta * 0.02;

      // Update 3D Energy Pulses Along Curves
      arcPulses.forEach((p) => {
        p.progress += delta * p.speed;
        if (p.progress > 1) p.progress = 0;
        const currentPos = p.curve.getPoint(p.progress);
        p.mesh.position.copy(currentPos);
      });

      // Smooth Dynamic Mouse Parallax Camera Tracking
      const targetCamX = mouseRef.current.x * 3.5;
      const targetCamY = 15 - mouseRef.current.y * 3.5;
      camera.position.x += (targetCamX - camera.position.x) * 0.05;
      camera.position.y += (targetCamY - camera.position.y) * 0.05;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
};


