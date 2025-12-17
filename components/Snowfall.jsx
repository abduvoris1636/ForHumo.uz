'use client';

import { useEffect, useState } from 'react';

export default function Snowfall() {
  const [snowflakes, setSnowflakes] = useState([]);

  useEffect(() => {
    const createSnowflakes = () => {
      const flakes = [];
      for (let i = 0; i < 50; i++) {
        flakes.push({
          id: i,
          left: Math.random() * 100,
          size: Math.random() * 4 + 2,
          duration: Math.random() * 10 + 5,
          delay: Math.random() * 5,
        });
      }
      setSnowflakes(flakes);
    };

    createSnowflakes();
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden">
      {snowflakes.map((flake) => (
        <div
          key={flake.id}
          className="absolute rounded-full bg-white/30"
          style={{
            left: `${flake.left}%`,
            width: `${flake.size}px`,
            height: `${flake.size}px`,
            top: '-20px',
            animation: `snow ${flake.duration}s linear ${flake.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
}
