// Copyright 2018-2024 the Deno authors. All rights reserved. MIT license.
// This module is browser compatible.

/**
 * Filters the elements of an async iterable based on a predicate function.
 *
 * @template T The type of elements in the async iterable.
 * @param iterator The async iterable to filter.
 * @param predicate The predicate function used to filter the elements.
 * @returns An async iterable iterator that contains the filtered elements.
 * @example
 * ```ts
 * import { filter } from "https://deno.land/std@$STD_VERSION/async_iterator_helpers/filter.ts";
 *
 * const iterator = (async function* () {
 *   yield "spray";
 *   yield "elite";
 *   yield "exuberant";
 *   yield "destruction";
 *   yield "present";
 * })();
 *
 * const filtered = await Array.fromAsync(
 *   filter(iterator, (word) => word.length > 6),
 * );
 *
 * console.log(filtered); // ["exuberant", "destruction", "present"]
 * ```
 */
export function filter<T>(
  iterator: AsyncIterableIterator<T>,
  predicate: (value: T) => unknown,
): AsyncIterableIterator<T> {
  return {
    async next() {
      const result = await iterator.next();
      if (result.done) {
        return { done: true, value: undefined };
      }
      if (predicate(result.value)) {
        return result;
      }
      return await this.next();
    },
    [Symbol.asyncIterator]() {
      return this;
    },
  };
}
