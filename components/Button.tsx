import { ButtonHTMLAttributes } from 'react';
import { twMerge } from 'tailwind-merge';

/**
 * A higher-order function that wraps a given function to handle both
 * synchronous and asynchronous errors. Used to ensure that errors are
 * caught in event handlers and other places where they would otherwise be
 * uncaugh.
 *
 * @template A - The type of the arguments that the wrapped function accepts.
 * @param {(...args: A) => Promise<void> | void} fn - The function to be
 * wrapped. It can be either synchronous or asynchronous.
 * @returns {(...args: A) => void} - A new function that wraps the original
 * function and handles errors and returns a synchronous result.
 *
 * @example
 * // Usage with an asynchronous function in click handler
 * const handleClick = async () => { throw new Error('Asynchronous error'); };
 *
 * <Button onClick={errorWrapper(handleClick)}>Click me</Button>
 */
export function errorWrapper<A extends unknown[]>(
  fn: (...args: A) => Promise<void> | void,
): (...args: A) => void {
  return (...args: A) => {
    try {
      const p = fn(...args);
      // Check if the function returns a promise to catch async errors
      if (p instanceof Promise)
        p.catch((error: unknown) => {
          console.error('Error thrown asynchronously', error);
        });
    } catch (error) {
      console.error('Error thrown synchronously', error);
    }
  };
}

export function Button({
  children,
  className,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={twMerge(
        `mt-6 w-full rounded-md border border-lines bg-primary p-2 text-lg font-medium text-white disabled:bg-gray-300 disabled:text-gray-500`,
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
}
