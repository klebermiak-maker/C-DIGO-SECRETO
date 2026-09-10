import confetti from 'canvas-confetti';

/**
 * Confetti burst when completing an individual line/word.
 * Generates an energetic fountain of bright colors and festive particles.
 */
export function triggerLineCompletedConfetti(originX = 0.5, originY = 0.65) {
  // Center burst
  confetti({
    particleCount: 70,
    spread: 70,
    origin: { x: originX, y: originY },
    colors: ['#f59e0b', '#10b981', '#6366f1', '#ec4899', '#3b82f6', '#fbbf24'],
    startVelocity: 35,
    scalar: 1.1,
    ticks: 200,
  });

  // Secondary delayed sparkle burst
  setTimeout(() => {
    confetti({
      particleCount: 35,
      angle: 60,
      spread: 55,
      origin: { x: Math.max(0.1, originX - 0.15), y: originY },
      colors: ['#fbbf24', '#fef08a', '#34d399'],
      startVelocity: 25,
      scalar: 0.9,
    });
    confetti({
      particleCount: 35,
      angle: 120,
      spread: 55,
      origin: { x: Math.min(0.9, originX + 0.15), y: originY },
      colors: ['#fbbf24', '#fef08a', '#60a5fa'],
      startVelocity: 25,
      scalar: 0.9,
    });
  }, 120);
}

/**
 * Grand celebration confetti when completing an entire mission,
 * all 5 items of the worksheet, or peer challenge.
 * Multi-cannon fireworks volley across the entire screen.
 */
export function triggerFullMissionConfetti() {
  const duration = 2500;
  const animationEnd = Date.now() + duration;

  // Immediate central burst
  confetti({
    particleCount: 100,
    spread: 100,
    origin: { y: 0.6 },
    colors: ['#f59e0b', '#10b981', '#6366f1', '#ec4899', '#e11d48', '#fbbf24'],
    startVelocity: 45,
    scalar: 1.2,
  });

  // Continuous side cannons for 2.5 seconds
  const interval = window.setInterval(() => {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      return clearInterval(interval);
    }

    const particleCount = 40 * (timeLeft / duration);

    // Left cannon shooting up-right
    confetti({
      particleCount: Math.floor(particleCount),
      angle: 60,
      spread: 60,
      origin: { x: 0.05, y: 0.75 },
      colors: ['#f59e0b', '#10b981', '#3b82f6', '#fbbf24'],
      startVelocity: 40,
    });

    // Right cannon shooting up-left
    confetti({
      particleCount: Math.floor(particleCount),
      angle: 120,
      spread: 60,
      origin: { x: 0.95, y: 0.75 },
      colors: ['#ec4899', '#8b5cf6', '#10b981', '#f59e0b'],
      startVelocity: 40,
    });
  }, 220);
}
