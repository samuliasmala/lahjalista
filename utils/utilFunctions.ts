export async function sleep(timeoutTimeInMs: number) {
  await new Promise((r) => setTimeout(r, timeoutTimeInMs));
}

/**
 *
 * @returns either false or true
 */

export function randomBoolean() {
  return !Math.round(Math.random());
}

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
