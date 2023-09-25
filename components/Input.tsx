

export function Input({ id, className, autoComplete, type, placeholder, name, minLength, maxLength }: {
  id?: string;
  className?: string;
  autoComplete?: string;
  type?: string;
  placeholder?: string;
  name?: string;
  minLength?: number;
  maxLength?: number;
}) {
  return (
    <input
      id={id}
      className={className}
      autoComplete={autoComplete}
      type={type}
      placeholder={placeholder}
      name={name}
      minLength={minLength}
      maxLength={maxLength} />
  );
}
