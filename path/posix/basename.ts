// Copyright 2018-2024 the Deno authors. All rights reserved. MIT license.
// This module is browser compatible.

import { assertArgs, stripSuffix } from "../_common/basename.ts";

export function getLastSegment(path: string, separator: string): string {
  if (path === "") return "";
  const delimter = new RegExp(`${separator}+`);
  const segments = path.split(delimter).filter((segment) => segment !== "");
  return segments.length === 0 ? separator : segments.at(-1)!;
}

/**
 * Return the last portion of a `path`.
 * Trailing directory separators are ignored, and optional suffix is removed.
 *
 * @example Usage
 * ```ts
 * import { basename } from "@std/path/posix/basename";
 * import { assertEquals } from "@std/assert/assert-equals";
 *
 * assertEquals(basename("/home/user/Documents/"), "Documents");
 * assertEquals(basename("/home/user/Documents/image.png"), "image.png");
 * assertEquals(basename("/home/user/Documents/image.png", ".png"), "image");
 * ```
 *
 * @param path The path to extract the name from.
 * @param suffix The suffix to remove from extracted name.
 * @returns The extracted name.
 */
export function basename(path: string, suffix = ""): string {
  assertArgs(path, suffix);
  const lastSegment = getLastSegment(path, "/");

  return suffix ? stripSuffix(lastSegment, suffix) : lastSegment;
}
