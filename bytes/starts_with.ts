// Copyright 2018-2024 the Deno authors. All rights reserved. MIT license.
// This module is browser compatible.

/**
 * Determines whether the source buffer begins with the bytes of a specified
 * prefix buffer, returning `true` or `false` as appropriate. This is similar
 * in behavior to {@linkcode String.startsWith}.
 *
 * The complexity of this function is `O(prefix.length)`.
 *
 * @param source The buffer to search for the prefix.
 * @param prefix The bytes to be search for at the start of the source buffer.
 * @returns `true` if the given `prefix` bytes are found at the beginning of
 * the `source` buffer; otherwise, `false`.
 *
 * ```ts
 * import { startsWith } from "https://deno.land/std@$STD_VERSION/bytes/starts_with.ts";
 *
 * const source = new Uint8Array([0, 1, 2, 1, 2, 1, 2, 3]);
 * const prefix = new Uint8Array([0, 1, 2]);
 *
 * startsWith(source, prefix); // true
 * ```
 */
export function startsWith(
  targetBuffer: Uint8Array,
  searchBuffer: Uint8Array,
): boolean {
  for (let i = 0; i < searchBuffer.length; i++) {
    if (targetBuffer[i] !== searchBuffer[i]) return false;
  }
  return true;
}
