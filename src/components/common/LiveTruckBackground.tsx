import React, { useEffect, useRef } from 'react';

interface Lane {
  y: number;
  speed: number;
  scale: number;
  color: string;
  startFraction: number;
  dir: 1 | -1;
}

const LANES: Lane[] = [
  { y: 0.08, speed: 38, scale: 0.55, color: '#6366F1', startFraction: 0.05, dir: 1 },
  { y: 0.18, speed: 26, scale: 0.44, color: '#8B5CF6', startFraction: 0.70, dir: -1 },
  { y: 0.30, speed: 52, scale: 0.62, color: '#14B8A6', startFraction: 0.20, dir: 1 },
  { y: 0.42, speed: 20, scale: 0.40, color: '#F59E0B', startFraction: 0.85, dir: -1 },
  { y: 0.55, speed: 44, scale: 0.58, color: '#EF4444', startFraction: 0.10, dir: 1 },
  { y: 0.67, speed: 30, scale: 0.48, color: '#10B981', startFraction: 0.55, dir: -1 },
  { y: 0.78, speed: 58, scale: 0.65, color: '#EC4899', startFraction: 0.30, dir: 1 },
  { y: 0.88, speed: 22, scale: 0.42, color: '#06B6D4', startFraction: 0.90, dir: -1 },
];

function drawTruck(
  ctx: CanvasRenderingContext2D,
  x: number, y: number,
  scale: number, color: string,
  dir: 1 | -1
) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(dir * scale, scale);

  // Trailer
  ctx.fillStyle = color + '28';
  ctx.strokeStyle = color + '55';
  ctx.lineWidth = 1.5 / scale;
  ctx.beginPath();
  (ctx as any).roundRect(-90, -18, 80, 34, 4);
  ctx.fill();
  ctx.stroke();

  // Trailer stripe
  ctx.fillStyle = color + '45';
  ctx.beginPath();
  (ctx as any).roundRect(-86, -13, 72, 6, 2);
  ctx.fill();

  // Cab
  ctx.fillStyle = color + '38';
  ctx.strokeStyle = color + '70';
  ctx.beginPath();
  (ctx as any).roundRect(-10, -22, 32, 36, [6,4,0,0]);
  ctx.fill();
  ctx.stroke();

  // Windshield
  ctx.fillStyle = color + '50';
  ctx.beginPath();
  (ctx as any).roundRect(-6, -18, 20, 11, 2);
  ctx.fill();

  // Exhaust
  ctx.strokeStyle = color + '60';
  ctx.lineWidth = 2 / scale;
  ctx.beginPath();
  ctx.moveTo(16, -24);
  ctx.lineTo(16, -32);
  ctx.stroke();

  // Wheels
  const wPositions = [[-70, 16], [-50, 16], [-28, 16], [12, 16]];
  for (const [wx, wy] of wPositions) {
    ctx.fillStyle = color + '65';
    ctx.beginPath();
    ctx.arc(wx, wy, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffffff15';
    ctx.beginPath();
    ctx.arc(wx, wy, 3, 0, Math.PI * 2);
    ctx.fill();
  }

  // Headlight glow
  const glowX = dir === 1 ? 24 : -88;
  const grd = ctx.createRadialGradient(glowX, 0, 0, glowX, 0, 30);
  grd.addColorStop(0, color + '35');
  grd.addColorStop(1, color + '00');
  ctx.fillStyle = grd;
  ctx.beginPath();
  ctx.arc(glowX, 0, 30, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

export const LiveTruckBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const xRef = useRef<number[]>([]);
  const lastRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      xRef.current = LANES.map(l => l.startFraction * canvas.width);
    };
    resize();
    window.addEventListener('resize', resize);

    const tick = (t: number) => {
      const dt = Math.min((t - lastRef.current) / 1000, 0.1);
      lastRef.current = t;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const W = canvas.width;
      const H = canvas.height;
      LANES.forEach((lane, i) => {
        let x = xRef.current[i] ?? 0;
        x += lane.dir * lane.speed * dt;
        if (lane.dir === 1 && x > W + 160) x = -200;
        if (lane.dir === -1 && x < -200) x = W + 160;
        xRef.current[i] = x;
        drawTruck(ctx, x, lane.y * H, lane.scale, lane.color, lane.dir);
      });
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0, opacity: 1 }}
    />
  );
};
