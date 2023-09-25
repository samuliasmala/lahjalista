import { MouseEventHandler, ReactNode } from 'react';

export function Button({
  id,
  handleClick,
  children,
  className,
  onMouseOver,
  onMouseOut
}: {
  id?: string;
  handleClick?: (event?: any) => void;
  children?: ReactNode;
  className?: string;
  isDisabled?: boolean;
  onMouseOver?: MouseEventHandler<HTMLButtonElement>;
  onMouseOut?: MouseEventHandler<HTMLButtonElement>
}) {
  return (
    <button
      id={id}
      className={className}
      type="button"
      onClick={handleClick}
      onMouseOver={onMouseOver}
      onMouseOut={onMouseOut}
    >
      {children}
    </button>
  );
}
