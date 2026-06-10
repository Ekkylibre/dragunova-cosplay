/** Pseudo-aléatoire déterministe : identique côté serveur et client (pas d'erreur d'hydratation). */
function rand(i: number, salt: number) {
  const x = Math.sin(i * 127.1 + salt * 311.7) * 43758.5453;
  return x - Math.floor(x);
}

const particles = Array.from({ length: 28 }, (_, i) => ({
  left: rand(i, 1) * 100,
  size: 1.5 + rand(i, 2) * 2.5,
  delay: rand(i, 3) * 14,
  duration: 11 + rand(i, 4) * 16,
  violet: rand(i, 5) > 0.45,
}));

/** Poussières magiques qui s'élèvent lentement. */
export default function Particles() {
  return (
    <div aria-hidden className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p, i) => (
        <span
          key={i}
          className="particle"
          style={{
            left: `${p.left}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            background: p.violet ? "#9d7bff" : "#67e8f9",
            boxShadow: `0 0 ${p.size * 4}px ${p.violet ? "#9d7bff" : "#67e8f9"}`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
          }}
        />
      ))}
    </div>
  );
}
