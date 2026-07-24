interface Option<T extends string> {
  value: T;
  label: string;
  icon?: React.ReactNode;
}

interface SegmentedControlProps<T extends string> {
  name: string;
  value: T;
  onChange: (value: T) => void;
  options: Option<T>[];
  fill?: boolean;
}

export default function SegmentedControl<T extends string>({ name, value, onChange, options, fill }: SegmentedControlProps<T>) {
  return (
    <div className="seg" style={fill ? { width: '100%' } : undefined}>
      {options.map((opt) => (
        <label
          key={opt.value}
          className="seg-opt"
          style={fill ? { flex: 1, justifyContent: 'center' } : undefined}
        >
          <input
            type="radio"
            name={name}
            checked={value === opt.value}
            onChange={() => onChange(opt.value)}
          />
          {opt.icon}
          {opt.label}
        </label>
      ))}
    </div>
  );
}
