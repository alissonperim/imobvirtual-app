import { useEffect, useRef, useState } from 'react';

interface OtpInputProps {
  length?: number;
  error?: boolean;
  disabled?: boolean;
  resetSignal?: unknown;
  onChange?: (code: string) => void;
  onComplete: (code: string) => void;
}

export default function OtpInput({ length = 6, error = false, disabled = false, resetSignal, onChange, onComplete }: OtpInputProps) {
  const [digits, setDigits] = useState<string[]>(() => Array(length).fill(''));
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    setDigits(Array(length).fill(''));
    refs.current[0]?.focus();
  }, [resetSignal, length]);

  useEffect(() => {
    refs.current[0]?.focus();
  }, []);

  function setDigitAt(index: number, val: string) {
    const next = [...digits];
    next[index] = val;
    setDigits(next);
    onChange?.(next.join(''));
    return next;
  }

  function handleChange(index: number, raw: string) {
    const val = raw.replace(/\D/g, '').slice(-1);
    const next = setDigitAt(index, val);
    if (val && index < length - 1) refs.current[index + 1]?.focus();
    // Only auto-submit when the box just filled is the last one — otherwise a
    // stale digit left over in a later box (e.g. after retyping post-error)
    // would make the code look "complete" before the user finishes retyping.
    if (index === length - 1 && next.every((d) => d !== '')) onComplete(next.join(''));
  }

  function handleKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      refs.current[index - 1]?.focus();
      setDigitAt(index - 1, '');
    }
  }

  function handlePaste(e: React.ClipboardEvent<HTMLInputElement>) {
    const text = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);
    if (!text) return;
    e.preventDefault();
    const next = Array(length).fill('');
    for (let i = 0; i < text.length; i++) next[i] = text[i];
    setDigits(next);
    onChange?.(next.join(''));
    const focusIndex = Math.min(text.length, length - 1);
    refs.current[focusIndex]?.focus();
    if (next.every((d) => d !== '')) onComplete(next.join(''));
  }

  return (
    <div style={{ display: 'flex', gap: 8, justifyContent: 'space-between' }}>
      {digits.map((d, i) => (
        <input
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          value={d}
          disabled={disabled}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={handlePaste}
          onFocus={(e) => e.target.select()}
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={1}
          aria-label={`Dígito ${i + 1} do código`}
          style={{
            width: 40, height: 52, borderRadius: 12, textAlign: 'center',
            fontSize: 22, fontWeight: 700, fontFamily: 'var(--font-heading)',
            background: error ? 'var(--color-danger-bg)' : 'var(--color-surface)',
            border: `1.5px solid ${error ? 'var(--color-danger)' : d ? 'var(--color-accent)' : 'var(--color-divider)'}`,
            color: error ? 'var(--color-danger-text)' : 'var(--color-text)',
            outline: 'none',
          }}
        />
      ))}
    </div>
  );
}
