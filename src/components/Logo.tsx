import { Home } from 'lucide-react';

interface LogoProps {
  size?: number;
  withWordmark?: boolean;
  wordmarkColor?: string;
  onDark?: boolean;
}

export default function Logo({ size = 34, withWordmark = true, wordmarkColor, onDark = false }: LogoProps) {
  const iconSize = Math.round(size * 0.56);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: size * 0.28 }}>
      <div
        style={{
          width: size, height: size, borderRadius: size * 0.32, flex: 'none',
          background: 'var(--color-accent)', display: 'grid', placeItems: 'center',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <Home size={iconSize} color="#ffffff" strokeWidth={2.5} />
      </div>
      {withWordmark && (
        <span
          style={{
            fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: size * 0.5,
            color: wordmarkColor ?? (onDark ? '#ffffff' : 'var(--color-text)'), lineHeight: 1,
          }}
        >
          Imobvirtual
        </span>
      )}
    </div>
  );
}
