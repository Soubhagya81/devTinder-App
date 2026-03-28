import { useEffect, useRef, useCallback } from "react";

/**
 * Particle Network Background — based on Julian Laval's CodePen (KpLXOO).
 * Floating particles with lines connecting nearby nodes + mouse interaction.
 */

interface ParticleOptions {
  density: number;       // lower = more particles
  color: string;         // particle colour
  lineColor: string;     // connection line colour
  particleRadius: number;
  lineWidth: number;
  proximity: number;     // max connection distance
  speed: number;
  interactive: boolean;
}

const DEFAULTS: ParticleOptions = {
  density: 11000,
  color: "#ffffff",
  lineColor: "#ffffff",
  particleRadius: 2,
  lineWidth: 0.7,
  proximity: 150,
  speed: 0.5,
  interactive: true,
};

interface Dot {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

export const ParticleNetwork: React.FC<{ className?: string }> = ({
  className,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const dotsRef = useRef<Dot[]>([]);
  const mouseRef = useRef<{ x: number; y: number } | null>(null);
  const optsRef = useRef<ParticleOptions>(DEFAULTS);

  /* -------- helpers -------- */
  const createDots = useCallback((w: number, h: number) => {
    const opts = optsRef.current;
    const count = Math.floor((w * h) / opts.density);
    const dots: Dot[] = [];
    for (let i = 0; i < count; i++) {
      dots.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * opts.speed,
        vy: (Math.random() - 0.5) * opts.speed,
      });
    }
    dotsRef.current = dots;
  }, []);

  /* -------- main effect -------- */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const opts = optsRef.current;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      createDots(canvas.width, canvas.height);
    };
    resize();

    /* mouse / touch handlers — listen on window so overlaying content doesn't block */
    const onMove = (e: MouseEvent | TouchEvent) => {
      const rect = canvas.getBoundingClientRect();
      let clientX: number, clientY: number;
      if ("touches" in e) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else {
        clientX = e.clientX;
        clientY = e.clientY;
      }
      const x = clientX - rect.left;
      const y = clientY - rect.top;
      // only track if inside canvas bounds
      if (x >= 0 && x <= canvas.width && y >= 0 && y <= canvas.height) {
        mouseRef.current = { x, y };
      } else {
        mouseRef.current = null;
      }
    };
    const onLeave = () => {
      mouseRef.current = null;
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("touchmove", onMove, { passive: true });
    window.addEventListener("touchend", onLeave);
    window.addEventListener("resize", resize);

    /* animation loop */
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const dots = dotsRef.current;
      const mouse = mouseRef.current;

      for (let i = 0; i < dots.length; i++) {
        const d = dots[i];

        // move
        d.x += d.vx;
        d.y += d.vy;

        // bounce
        if (d.x < 0 || d.x > canvas.width) d.vx *= -1;
        if (d.y < 0 || d.y > canvas.height) d.vy *= -1;

        // draw dot
        ctx.fillStyle = opts.color;
        ctx.beginPath();
        ctx.arc(d.x, d.y, opts.particleRadius, 0, Math.PI * 2);
        ctx.fill();

        // lines to nearby dots
        for (let j = i + 1; j < dots.length; j++) {
          const d2 = dots[j];
          const dx = d.x - d2.x;
          const dy = d.y - d2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < opts.proximity) {
            ctx.strokeStyle = opts.lineColor;
            ctx.globalAlpha = 1 - dist / opts.proximity;
            ctx.lineWidth = opts.lineWidth;
            ctx.beginPath();
            ctx.moveTo(d.x, d.y);
            ctx.lineTo(d2.x, d2.y);
            ctx.stroke();
            ctx.globalAlpha = 1;
          }
        }

        // lines to mouse
        if (opts.interactive && mouse) {
          const dx = d.x - mouse.x;
          const dy = d.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < opts.proximity * 1.5) {
            ctx.strokeStyle = opts.lineColor;
            ctx.globalAlpha = 1 - dist / (opts.proximity * 1.5);
            ctx.lineWidth = opts.lineWidth;
            ctx.beginPath();
            ctx.moveTo(d.x, d.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();
            ctx.globalAlpha = 1;
          }
        }
      }

      // draw mouse node
      if (opts.interactive && mouse) {
        ctx.fillStyle = opts.color;
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, opts.particleRadius * 1.5, 0, Math.PI * 2);
        ctx.fill();
      }

      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend", onLeave);
      window.removeEventListener("resize", resize);
    };
  }, [createDots]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full ${className ?? ""}`}
      style={{ zIndex: 0 }}
    />
  );
};
