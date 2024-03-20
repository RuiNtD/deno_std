// Copyright 2018-2024 the Deno authors. All rights reserved. MIT license.
// This module is browser compatible.
import { filter } from "./filter.ts";
import { assertEquals } from "../assert/assert_equals.ts";

// Copied from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter#try_it
Deno.test("filter()", async () => {
  const iterator = (async function* () {
    yield "spray";
    yield "elite";
    yield "exuberant";
    yield "destruction";
    yield "present";
  })();
  const filtered = await Array.fromAsync(
    filter(iterator, (word) => word.length > 6),
  );

  assertEquals(filtered, ["exuberant", "destruction", "present"]);
});
