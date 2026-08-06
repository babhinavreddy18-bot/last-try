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
    const particleCount = 80;
    const particles: Particle[] = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      z: Math.random() * 2 + 0.5,
      vx: (Math.random() - 0.5) * 0.4,
      vy: -0.2 - Math.random() * 0.5,
      size: Math.random() * 2.5 + 1,
      alpha: Math.random() * 0.6 + 0.2,
    }));

    // ── 2. Create Dynamic Perspective Light Pulses ──────────────────
    // Highway lane 3D perspective lines converging towards horizon (vanishing point ~ center high)
    const lanes = [
      { startX: 0.15, endX: 0.48, color: '#06B6D4' },
      { startX: 0.35, endX: 0.49, color: '#3B82F6' },
      { startX: 0.55, endX: 0.50, color: '#6366F1' },
      { startX: 0.75, endX: 0.51, color: '#8B5CF6' },
      { startX: 0.90, endX: 0.52, color: '#10B981' },
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

      const isDark = document.documentElement.classList.contains('dark');
      ctx.clearRect(0, 0, width, height);

      const vanishingX = width * 0.5 + mouseRef.current.x * 2;
      const vanishingY = height * 0.42 + mouseRef.current.y * 2;

      // ── 3. Render Moving 3D Light Stream Pulses ──────────────────
      pulses.forEach((p) => {
        p.progress += dt * p.speed;
        if (p.progress > 1) p.progress = 0;

        const startX = p.startX * width;
        const startY = height * 1.05;

        // Interpolate along perspective line
        const currentX = startX + (vanishingX - startX) * p.progress;
        const currentY = startY + (vanishingY - startY) * p.progress;
        const currentSize = (1 - p.progress) * 18 + 2;

        const glowGradient = ctx.createRadialGradient(currentX, currentY, 0, currentX, currentY, currentSize * 2.5);
        glowGradient.addColorStop(0, p.color + (isDark ? 'E0' : '90'));
        glowGradient.addColorStop(0.5, p.color + (isDark ? '40' : '20'));
        glowGradient.addColorStop(1, 'transparent');

        ctx.fillStyle = glowGradient;
        ctx.beginPath();
        ctx.arc(currentX, currentY, currentSize * 2.5, 0, Math.PI * 2);
        ctx.fill();
      });

      // ── 4. Render Floating Ambient Atmosphere Particles ─────────
      particles.forEach((pt) => {
        pt.x += pt.vx;
        pt.y += pt.vy;

        if (pt.y < -10) pt.y = height + 10;
        if (pt.x < -10 || pt.x > width + 10) pt.x = Math.random() * width;

        ctx.save();
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, pt.size * pt.z, 0, Math.PI * 2);
        ctx.fillStyle = isDark ? `rgba(99, 102, 241, ${pt.alpha})` : `rgba(37, 99, 235, ${pt.alpha * 0.6})`;
        ctx.fill();
        ctx.restore();
      });

      // ── 5. Horizon Scanning Telemetry Laser ─────────────────────
      const scanY = vanishingY + Math.sin(time * 0.0015) * 40;
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(0, scanY);
      ctx.lineTo(width, scanY);
      ctx.strokeStyle = isDark ? 'rgba(6, 182, 212, 0.15)' : 'rgba(37, 99, 235, 0.08)';
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
      {/* Photorealistic 3D Highway Image Background Layer */}
      <div
        ref={containerRef}
        className="absolute inset-0 w-full h-full bg-cover bg-center transition-transform duration-100 ease-out"
        style={{
          backgroundImage: `url(${bgImage})`,
          filter: 'brightness(0.92) contrast(1.08)',
        }}
      />

      {/* Dark/Light Theme Blend Overlay */}
      <div className="absolute inset-0 bg-slate-950/40 dark:bg-slate-950/60 backdrop-blur-[2px] transition-colors" />

      {/* Live Animated Canvas Telemetry & Motion Overlay */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
    </div>
  );
};



