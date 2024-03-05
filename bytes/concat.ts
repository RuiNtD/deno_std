// Copyright 2018-2024 the Deno authors. All rights reserved. MIT license.
// This module is browser compatible.

/**
 * Merges two or more {@linkcode Uint8Array}s. This function does not change
 * existing arrays, but instead returns a new array. This function is similar
 * in behavior to {@linkcode Array.concat}.
 *
 * @param buffers {@linkcode Uint8Array}s to concatenate into a new buffer.
 * @returns A new {@linkcode Uint8Array}.
 *
 * @example
 * ```ts
 * import { concat } from "https://deno.land/std@$STD_VERSION/bytes/concat.ts";
 *
 * const a = new Uint8Array([0, 1, 2]);
 * const b = new Uint8Array([3, 4, 5]);
 *
 * concat([a, b]); // Uint8Array(6) [ 0, 1, 2, 3, 4, 5 ]
 * ```
 */
export function concat(buffers: Uint8Array[]): Uint8Array {
  let length = 0;
  for (const buffer of buffers) {
    length += buffer.length;
  }
  const output = new Uint8Array(length);
  let index = 0;
  for (const buffer of buffers) {
    output.set(buffer, index);
    index += buffer.length;
  }

  return output;
}
