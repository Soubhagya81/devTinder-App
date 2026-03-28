import { useEffect, useRef, useCallback } from "react";

/**
 * Space Particles Background — deep space with twinkling multi-coloured stars,
 * parallax depth layers, shooting stars, and mouse-push interaction.
 * No connecting lines.
 */

interface SpaceStar {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  depth: number;        // 0-1, controls parallax + brightness
  twinklePhase: number;
  twinkleSpeed: number;
  hue: number;          // colour hue (blue / cyan / white / purple range)
}

interface ShootingStar {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  length: number;
}

export const ConstellationBackground: React.FC<{ className?: string }> = ({
  className,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const starsRef = useRef<SpaceStar[]>([]);
  const shootingRef = useRef<ShootingStar[]>([]);
  const mouseRef = useRef<{ x: number; y: number } | null>(null);
  const timeRef = useRef(0);

  const createStars = useCallback((w: number, h: number) => {
    const count = Math.floor((w * h) / 3500); // dense star field
    const stars: SpaceStar[] = [];
    for (let i = 0; i < count; i++) {
      const depth = Math.random();
      stars.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.15 * (depth + 0.2),
        vy: (Math.random() - 0.5) * 0.15 * (depth + 0.2),
        radius: depth * 1.8 + 0.3,
        depth,
        twinklePhase: Math.random() * Math.PI * 2,
        twinkleSpeed: Math.random() * 0.04 + 0.01,
        hue: Math.random() < 0.6
          ? 210 + Math.random() * 40   // blue-cyan range
          : Math.random() < 0.5
            ? 270 + Math.random() * 30  // purple range
            : 40 + Math.random() * 20,  // warm white / yellow
      });
    }
    starsRef.current = stars;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      createStars(canvas.width, canvas.height);
    };
    resize();

    // Mouse / touch — listen on window so overlay elements don't block
    const onMove = (e: MouseEvent | TouchEvent) => {
      const rect = canvas.getBoundingClientRect();
      let cx: number, cy: number;
      if ("touches" in e) {
        cx = e.touches[0].clientX;
        cy = e.touches[0].clientY;
      } else {
        cx = e.clientX;
        cy = e.clientY;
      }
      const x = cx - rect.left;
      const y = cy - rect.top;
      if (x >= 0 && x <= canvas.width && y >= 0 && y <= canvas.height) {
        mouseRef.current = { x, y };
      } else {
        mouseRef.current = null;
      }
    };
    const onLeave = () => { mouseRef.current = null; };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("touchmove", onMove, { passive: true });
    window.addEventListener("touchend", onLeave);
    window.addEventListener("resize", resize);

    const pushRadius = 100;
    const pushStrength = 3;

    const animate = () => {
      timeRef.current += 1;

      // Clear with solid black-space colour
      ctx.fillStyle = "#050a18";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const stars = starsRef.current;
      const mouse = mouseRef.current;

      // --- Draw stars ---
      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];

        // Mouse push — repel nearby stars
        if (mouse) {
          const dx = s.x - mouse.x;
          const dy = s.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < pushRadius && dist > 0) {
            const force = ((pushRadius - dist) / pushRadius) * pushStrength * s.depth;
            s.vx += (dx / dist) * force;
            s.vy += (dy / dist) * force;
          }
        }

        // Move
        s.x += s.vx;
        s.y += s.vy;

        // Dampen velocity back to drift
        s.vx *= 0.97;
        s.vy *= 0.97;

        // Wrap around edges
        if (s.x < -5) s.x = canvas.width + 5;
        if (s.x > canvas.width + 5) s.x = -5;
        if (s.y < -5) s.y = canvas.height + 5;
        if (s.y > canvas.height + 5) s.y = -5;

        // Twinkle
        const twinkle = Math.sin(timeRef.current * s.twinkleSpeed + s.twinklePhase);
        const brightness = 0.4 + s.depth * 0.6;
        const alpha = brightness * (0.6 + twinkle * 0.4);

        // Glow for larger / closer stars
        if (s.depth > 0.5) {
          const glowR = s.radius * (3 + twinkle);
          const grad = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, glowR);
          grad.addColorStop(0, `hsla(${s.hue}, 80%, 80%, ${alpha * 0.35})`);
          grad.addColorStop(1, `hsla(${s.hue}, 80%, 80%, 0)`);
          ctx.fillStyle = grad;
          ctx.fillRect(s.x - glowR, s.y - glowR, glowR * 2, glowR * 2);
        }

        // Core dot
        ctx.fillStyle = `hsla(${s.hue}, 70%, 85%, ${alpha})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.radius * (0.8 + twinkle * 0.2), 0, Math.PI * 2);
        ctx.fill();
      }

      // --- Shooting stars ---
      // Randomly spawn
      if (Math.random() < 0.008) {
        const fromLeft = Math.random() < 0.5;
        shootingRef.current.push({
          x: fromLeft ? Math.random() * canvas.width * 0.5 : canvas.width * 0.5 + Math.random() * canvas.width * 0.5,
          y: Math.random() * canvas.height * 0.4,
          vx: (fromLeft ? 1 : -1) * (8 + Math.random() * 6),
          vy: 4 + Math.random() * 3,
          life: 0,
          maxLife: 40 + Math.random() * 30,
          length: 60 + Math.random() * 40,
        });
      }

      // Update & draw shooting stars
      const alive: ShootingStar[] = [];
      for (const ss of shootingRef.current) {
        ss.life++;
        ss.x += ss.vx;
        ss.y += ss.vy;

        const progress = ss.life / ss.maxLife;
        const fadeAlpha = progress < 0.3 ? progress / 0.3 : 1 - (progress - 0.3) / 0.7;

        const grad = ctx.createLinearGradient(
          ss.x, ss.y,
          ss.x - (ss.vx / Math.abs(ss.vx)) * ss.length,
          ss.y - (ss.vy / Math.abs(ss.vy)) * ss.length * 0.5
        );
        grad.addColorStop(0, `rgba(255, 255, 255, ${fadeAlpha * 0.9})`);
        grad.addColorStop(1, `rgba(255, 255, 255, 0)`);

        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(ss.x, ss.y);
        ctx.lineTo(
          ss.x - (ss.vx / Math.abs(ss.vx)) * ss.length,
          ss.y - (ss.vy / Math.abs(ss.vy)) * ss.length * 0.5
        );
        ctx.stroke();

        // bright head
        ctx.fillStyle = `rgba(255, 255, 255, ${fadeAlpha})`;
        ctx.beginPath();
        ctx.arc(ss.x, ss.y, 1.5, 0, Math.PI * 2);
        ctx.fill();

        if (ss.life < ss.maxLife) alive.push(ss);
      }
      shootingRef.current = alive;

      // --- Mouse glow ---
      if (mouse) {
        const grad = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, pushRadius);
        grad.addColorStop(0, "rgba(120, 140, 255, 0.08)");
        grad.addColorStop(0.5, "rgba(120, 140, 255, 0.03)");
        grad.addColorStop(1, "rgba(120, 140, 255, 0)");
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, pushRadius, 0, Math.PI * 2);
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
  }, [createStars]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full ${className ?? ""}`}
      style={{ zIndex: 0 }}
    />
  );
};
