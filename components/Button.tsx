import { MouseEventHandler, ReactNode } from 'react';

export function Button({
  id,
  handleClick,
  type,
  children,
  className,
  onMouseOver,
  onMouseOut
}: {
  id?: string;
  handleClick?: (event?: any) => void;
  children?: ReactNode;
  type: "button" | "submit" | "reset" | undefined;
  className?: string;
  isDisabled?: boolean;
  onMouseOver?: MouseEventHandler<HTMLButtonElement>;
  onMouseOut?: MouseEventHandler<HTMLButtonElement>
}) {
  return (
    <button
      id={id}
      className={className}
      type={type}
      onClick={handleClick}
      onMouseOver={onMouseOver}
      onMouseOut={onMouseOut}
    >
      {children}
    </button>
  );
}
