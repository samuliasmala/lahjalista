import { HTMLAttributes } from 'react';
import { twMerge } from 'tailwind-merge';

export function ErrorParagraph({
  className,
  errorText,
  ...rest
}: HTMLAttributes<HTMLParagraphElement> & { errorText: string | undefined }) {
  if (typeof errorText !== 'string' || errorText.length <= 0) return null;
  return (
    <p className={twMerge('max-w-xs text-red-600', className)} {...rest}>
      {errorText}
    </p>
  );
}
