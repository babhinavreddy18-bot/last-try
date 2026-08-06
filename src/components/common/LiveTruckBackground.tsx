import React, { useEffect, useRef } from 'react';
import bgImage from '../../assets/3d_highway_bg.png';

interface Particle {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
}

interface MovingTruck {
  laneIndex: number;
  progress: number;
  speed: number;
  label: string;
  color: string;
  isHeadingAway: boolean;
}

export const LiveTruckBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef<{ x: number; y: number; targetX: number; targetY: number }>({
    x: 0,
    y: 0,
    targetX: 0,
    targetY: 0,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // ── 1. Create Floating 3D Particle Cloud ───────────────────────
    const particleCount = 70;
    const particles: Particle[] = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      z: Math.random() * 2 + 0.5,
      vx: (Math.random() - 0.5) * 0.4,
      vy: -0.2 - Math.random() * 0.5,
      size: Math.random() * 2.5 + 1,
      alpha: Math.random() * 0.6 + 0.2,
    }));

    // ── 2. Perspective Highway Lanes ─────────────────────────────
    const lanes = [
      { startX: 0.12, endX: 0.46, color: '#06B6D4' },
      { startX: 0.32, endX: 0.48, color: '#8B5CF6' },
      { startX: 0.52, endX: 0.50, color: '#3B82F6' },
      { startX: 0.72, endX: 0.52, color: '#A855F7' },
      { startX: 0.88, endX: 0.54, color: '#10B981' },
    ];

    // ── 3. Live Moving 3D Semi-Trucks Fleet ───────────────────────
    const trucks: MovingTruck[] = [
      { laneIndex: 0, progress: 0.18, speed: 0.12, label: 'TRK-01 • 94 km/h', color: '#06B6D4', isHeadingAway: true },
      { laneIndex: 1, progress: 0.42, speed: 0.16, label: 'EXPRESS • 108 km/h', color: '#8B5CF6', isHeadingAway: false },
      { laneIndex: 2, progress: 0.68, speed: 0.14, label: 'CARGOLOOP • 98 km/h', color: '#3B82F6', isHeadingAway: true },
      { laneIndex: 3, progress: 0.28, speed: 0.18, label: 'TRK-07 • 102 km/h', color: '#A855F7', isHeadingAway: false },
      { laneIndex: 4, progress: 0.82, speed: 0.11, label: 'VOLVO-FH • 88 km/h', color: '#10B981', isHeadingAway: true },
      { laneIndex: 1, progress: 0.92, speed: 0.15, label: 'REFRIGERATED • 92 km/h', color: '#8B5CF6', isHeadingAway: true },
    ];

    const pulses = lanes.map((lane, i) => ({
      ...lane,
      progress: (i * 0.2) % 1,
      speed: 0.2 + Math.random() * 0.25,
    }));

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.targetX = (e.clientX / window.innerWidth - 0.5) * 20;
      mouseRef.current.targetY = (e.clientY / window.innerHeight - 0.5) * 15;
    };

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);

    let lastTime = performance.now();

    const render = (time: number) => {
      if (document.hidden) {
        animFrameId = requestAnimationFrame(render);
        return;
      }

      const dt = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      // Smooth camera parallax interpolation
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.08;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.08;

      if (containerRef.current) {
        containerRef.current.style.transform = `scale(1.04) translate3d(${mouseRef.current.x * -0.6}px, ${mouseRef.current.y * -0.6}px, 0)`;
      }

      ctx.clearRect(0, 0, width, height);

      const vanishingX = width * 0.5 + mouseRef.current.x * 2;
      const vanishingY = height * 0.42 + mouseRef.current.y * 2;

      // ── 4. Render Moving Highway Light Pulses ──────────────────
      pulses.forEach((p) => {
        p.progress += dt * p.speed;
        if (p.progress > 1) p.progress = 0;

        const startX = p.startX * width;
        const startY = height * 1.05;

        const currentX = startX + (vanishingX - startX) * p.progress;
        const currentY = startY + (vanishingY - startY) * p.progress;
        const currentSize = (1 - p.progress) * 18 + 2;

        const glowGradient = ctx.createRadialGradient(currentX, currentY, 0, currentX, currentY, currentSize * 2.5);
        glowGradient.addColorStop(0, p.color + 'E0');
        glowGradient.addColorStop(0.5, p.color + '40');
        glowGradient.addColorStop(1, 'transparent');

        ctx.fillStyle = glowGradient;
        ctx.beginPath();
        ctx.arc(currentX, currentY, currentSize * 2.5, 0, Math.PI * 2);
        ctx.fill();
      });

      // ── 5. Render Live Moving 3D Semi-Trucks ────────────────────
      trucks.forEach((trk) => {
        trk.progress += dt * trk.speed;
        if (trk.progress > 0.96) trk.progress = 0.04;

        const lane = lanes[trk.laneIndex];
        const startX = lane.startX * width;
        const startY = height * 1.05;

        // Calculate 3D perspective position & scale
        const curX = startX + (vanishingX - startX) * (1 - trk.progress);
        const curY = startY + (vanishingY - startY) * (1 - trk.progress);
        const scale = trk.progress * 1.4 + 0.25;

        const truckW = 44 * scale;
        const truckH = 22 * scale;

        ctx.save();
        ctx.translate(curX, curY);

        // Headlight / Taillight Beams Projection
        if (trk.isHeadingAway) {
          // Red Taillight Streaks
          const lightGlow = ctx.createRadialGradient(0, truckH * 0.4, 0, 0, truckH * 0.4, truckW * 1.2);
          lightGlow.addColorStop(0, 'rgba(239, 68, 68, 0.8)');
          lightGlow.addColorStop(1, 'transparent');
          ctx.fillStyle = lightGlow;
          ctx.beginPath();
          ctx.arc(0, truckH * 0.4, truckW * 1.2, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Forward Headlight Beams
          const beamGradient = ctx.createRadialGradient(0, -truckH * 0.5, 0, 0, -truckH * 1.8, truckW * 1.8);
          beamGradient.addColorStop(0, 'rgba(6, 182, 212, 0.9)');
          beamGradient.addColorStop(0.6, 'rgba(139, 92, 246, 0.3)');
          beamGradient.addColorStop(1, 'transparent');
          ctx.fillStyle = beamGradient;
          ctx.beginPath();
          ctx.arc(0, -truckH * 1.2, truckW * 1.8, 0, Math.PI * 2);
          ctx.fill();
        }

        // 3D Semi-Trailer Box
        ctx.fillStyle = '#141624';
        ctx.strokeStyle = trk.color;
        ctx.lineWidth = 1.5 * scale;
        ctx.beginPath();
        ctx.roundRect(-truckW / 2, -truckH / 2, truckW, truckH, 6 * scale);
        ctx.fill();
        ctx.stroke();

        // Neon Glow Roof Accent Line
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 1 * scale;
        ctx.beginPath();
        ctx.moveTo(-truckW * 0.35, -truckH * 0.25);
        ctx.lineTo(truckW * 0.35, -truckH * 0.25);
        ctx.stroke();

        // Live Floating Truck Label Tag
        if (scale > 0.5) {
          ctx.fillStyle = '#FFFFFF';
          ctx.font = `bold ${Math.max(9, Math.floor(10 * scale))}px sans-serif`;
          ctx.textAlign = 'center';
          ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
          ctx.shadowBlur = 6;
          ctx.fillText(trk.label, 0, -truckH * 0.7);
        }

        ctx.restore();
      });

      // ── 6. Render Floating Atmosphere Particles ────────────────
      particles.forEach((pt) => {
        pt.x += pt.vx;
        pt.y += pt.vy;

        if (pt.y < -10) pt.y = height + 10;
        if (pt.x < -10 || pt.x > width + 10) pt.x = Math.random() * width;

        ctx.save();
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, pt.size * pt.z, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(139, 92, 246, ${pt.alpha})`;
        ctx.fill();
        ctx.restore();
      });

      // ── 7. Laser Scan Horizon Line ─────────────────────────────
      const scanY = vanishingY + Math.sin(time * 0.0015) * 35;
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(0, scanY);
      ctx.lineTo(width, scanY);
      ctx.strokeStyle = 'rgba(139, 92, 246, 0.2)';
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.restore();

      animFrameId = requestAnimationFrame(render);
    };

    animFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animFrameId);
    };
  }, []);

  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
      {/* 3D Highway Image Background Layer */}
      <div
        ref={containerRef}
        className="absolute inset-0 w-full h-full bg-cover bg-center transition-transform duration-100 ease-out"
        style={{
          backgroundImage: `url(${bgImage})`,
          filter: 'brightness(0.82) contrast(1.15) saturate(1.2)',
        }}
      />

      {/* Cyber Dark Theme Blend Overlay */}
      <div className="absolute inset-0 bg-[#0C0D14]/30 backdrop-blur-[1px]" />

      {/* Live Animated Canvas Telemetry & Moving Trucks Overlay */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
    </div>
  );
};
