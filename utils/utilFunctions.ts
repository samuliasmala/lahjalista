import { QueryClient, useQueryClient } from '@tanstack/react-query';
import { multipleQueryKeys, singleQueryKey } from '~/shared/types';

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

// CHECK THIS, onko mitään järkeä
export async function invalidateSingleQueryKey(
  queryClient: QueryClient,
  queryKey: singleQueryKey,
) {
  await queryClient.invalidateQueries({
    queryKey: [`${queryKey}`],
  });
}

export async function invalidateMultipleQueryKeys(
  queryClient: QueryClient,
  queryKeyArray: multipleQueryKeys,
) {
  await queryClient.invalidateQueries({
    queryKey: queryKeyArray,
  });
}
