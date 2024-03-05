// Copyright 2018-2024 the Deno authors. All rights reserved. MIT license.
import { assert } from "../assert/mod.ts";
import { startsWith } from "./starts_with.ts";

Deno.test("startsWith()", () => {
  assert(startsWith(new Uint8Array([0, 1, 2]), new Uint8Array([0, 1])));
  assert(!startsWith(new Uint8Array([0, 1, 2]), new Uint8Array([0, 2])));
  assert(!startsWith(new Uint8Array([0, 1, 2]), new Uint8Array([0, 2, 3, 4])));

  const v = startsWith(new Uint8Array([0, 1, 2]), new Uint8Array([0, 1]));
  const v2 = startsWith(new Uint8Array([0, 1, 2]), new Uint8Array([0, 2]));
  const v3 = startsWith(
    new Uint8Array([0, 1, 2]),
    new Uint8Array([0, 2, 3, 4]),
  );
  assert(v);
  assert(!v2);
  assert(!v3);
});
