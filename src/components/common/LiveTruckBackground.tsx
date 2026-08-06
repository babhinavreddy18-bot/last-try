import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
}

export const LiveTruckBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Create 60 minimal floating ambient particles
    const particleCount = 60;
    const particles: Particle[] = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: -0.15 - Math.random() * 0.35,
      radius: Math.random() * 2 + 1,
      alpha: Math.random() * 0.45 + 0.15,
    }));

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    const render = () => {
      if (document.hidden) {
        animFrameId = requestAnimationFrame(render);
        return;
      }

      ctx.clearRect(0, 0, width, height);

      const isDark = document.documentElement.classList.contains('dark');

      // Soft ambient corner light glow
      const glow1 = ctx.createRadialGradient(width * 0.2, height * 0.2, 0, width * 0.2, height * 0.2, width * 0.4);
      glow1.addColorStop(0, isDark ? 'rgba(139, 92, 246, 0.08)' : 'rgba(99, 102, 241, 0.04)');
      glow1.addColorStop(1, 'transparent');
      ctx.fillStyle = glow1;
      ctx.fillRect(0, 0, width, height);

      const glow2 = ctx.createRadialGradient(width * 0.8, height * 0.7, 0, width * 0.8, height * 0.7, width * 0.4);
      glow2.addColorStop(0, isDark ? 'rgba(6, 182, 212, 0.06)' : 'rgba(37, 99, 235, 0.03)');
      glow2.addColorStop(1, 'transparent');
      ctx.fillStyle = glow2;
      ctx.fillRect(0, 0, width, height);

      // Render floating particles and subtle constellation lines
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        p1.x += p1.vx;
        p1.y += p1.vy;

        if (p1.y < -10) p1.y = height + 10;
        if (p1.x < -10 || p1.x > width + 10) p1.x = Math.random() * width;

        // Draw particle dot
        ctx.beginPath();
        ctx.arc(p1.x, p1.y, p1.radius, 0, Math.PI * 2);
        ctx.fillStyle = isDark
          ? `rgba(168, 85, 247, ${p1.alpha})`
          : `rgba(99, 102, 241, ${p1.alpha * 0.8})`;
        ctx.fill();

        // Draw subtle connecting lines between nearby particles
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 110) {
            const lineAlpha = (1 - dist / 110) * 0.12;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = isDark
              ? `rgba(139, 92, 246, ${lineAlpha})`
              : `rgba(99, 102, 241, ${lineAlpha * 0.7})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      animFrameId = requestAnimationFrame(render);
    };

    animFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animFrameId);
    };
  }, []);

  return (
    <div className="fixed inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
};
