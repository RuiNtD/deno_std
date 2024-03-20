// Copyright 2018-2024 the Deno authors. All rights reserved. MIT license.
// This module is browser compatible.

/**
 * {@link https://github.com/tc39/proposal-async-iterator-helpers | TC39's Async Iterator Helpers}
 * proposal as pure TypeScript functions.
 *
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
 *
 * @module
 */
export * from "./filter.ts";
