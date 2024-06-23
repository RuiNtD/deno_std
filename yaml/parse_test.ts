// Ported from js-yaml v3.13.1:
// https://github.com/nodeca/js-yaml/commit/665aadda42349dcae869f12040d9b10ef18d12da
// Copyright 2011-2015 by Vitaly Puzrin. All rights reserved. MIT license.
// Copyright 2018-2024 the Deno authors. All rights reserved. MIT license.

import { parse } from "./parse.ts";
import { assert, assertEquals, assertThrows } from "@std/assert";
import { YAMLError } from "./_error.ts";

Deno.test({
  name: "parse() handles single document yaml string",
  fn() {
    const yaml = `
      test: toto
      foo:
        bar: True
        baz: 1
        qux: ~
    `;

    const expected = { test: "toto", foo: { bar: true, baz: 1, qux: null } };

    assertEquals(parse(yaml), expected);
  },
});

Deno.test({
  name: "parse() throws with `!!js/*` yaml types with default schemas",
  fn() {
    const yaml = `undefined: !!js/undefined ~`;
    assertThrows(() => parse(yaml), YAMLError, "unknown tag !");
  },
});

Deno.test({
  name: "parse() handles __proto__",
  async fn() {
    // Tests if the value is set using `Object.defineProperty(target, key, {value})`
    // instead of `target[key] = value` when parsing the object.
    // This makes a difference in behavior when __proto__ is set in Node.js and browsers.
    // Using `Object.defineProperty` avoids prototype pollution in Node.js and browsers.
    // reference: https://github.com/advisories/GHSA-9c47-m6qq-7p4h (CVE-2022-46175)

    const yaml1 = `
__proto__:
  isAdmin: true
    `;

    const yaml2 = `
anchor: &__proto__
  __proto__: 1111
alias_test:
  aaa: *__proto__
merge_test:
  bbb: 2222
  <<: *__proto__
    `;

    const testCode = `
      Object.defineProperty(Object.prototype, "__proto__", {
        set() {
          throw new Error("Don't try to set the value directly to the key __proto__.")
        }
      });
      import { parse } from "${import.meta.resolve("./parse.ts")}";
      parse(\`${yaml1}\`);
      parse(\`${yaml2}\`);
    `;
    const command = new Deno.Command(Deno.execPath(), {
      stdout: "inherit",
      stderr: "inherit",
      args: ["eval", "--no-lock", testCode],
    });
    const { success } = await command.output();
    assert(success);
  },
});

Deno.test({
  name: "parse() returns `null` when yaml is empty or only comments",
  fn() {
    const expected = null;

    const yaml1 = ``;
    assertEquals(parse(yaml1), expected);
    const yaml2 = ` \n\n `;
    assertEquals(parse(yaml2), expected);
    const yaml3 = `# just a bunch of comments \n # in this file`;
    assertEquals(parse(yaml3), expected);
  },
});

Deno.test({
  name: "parse() handles binary type",
  fn() {
    const yaml = `message: !!binary "SGVsbG8="`;
    assertEquals(parse(yaml), {
      message: new Uint8Array([72, 101, 108, 108, 111]),
    });
  },
});

Deno.test({
  name: "parse() handles float types",
  fn() {
    const yaml = `
      - 3.14
      - -3.14
      - .inf
      - -.inf
      - .nan
      - 12e03
      - 1:15
      - 1:15:20
      - -1:15:20
      - !!float 12000
    `;

    assertEquals(parse(yaml), [
      3.14,
      -3.14,
      Infinity,
      -Infinity,
      NaN,
      12000,
      75,
      4520,
      -4520,
      12000,
    ]);
  },
});

Deno.test({
  name: "parse() handles omap type",
  fn() {
    const yaml = `--- !!omap
- Mark McGwire: 65
- Sammy Sosa: 63
- Ken Griffey: 58
`;
    assertEquals(parse(yaml), [
      { "Mark McGwire": 65 },
      { "Sammy Sosa": 63 },
      { "Ken Griffey": 58 },
    ]);

    // Invalid omap
    // map entry is not an object
    assertThrows(
      () => parse("--- !!omap\n- 1"),
      YAMLError,
      "cannot resolve a node with !<tag:yaml.org,2002:omap> explicit tag",
    );
    // map entry is empty object
    assertThrows(
      () => parse("--- !!omap\n- {}"),
      YAMLError,
      "cannot resolve a node with !<tag:yaml.org,2002:omap> explicit tag",
    );
    // map entry is an object with multiple keys
    assertThrows(
      () => parse("--- !!omap\n- foo: 1\n  bar: 2"),
      YAMLError,
      "cannot resolve a node with !<tag:yaml.org,2002:omap> explicit tag",
    );
    // 2 map entries have the same key
    assertThrows(
      () => parse("--- !!omap\n- foo: 1\n- foo: 2"),
      YAMLError,
      "cannot resolve a node with !<tag:yaml.org,2002:omap> explicit tag",
    );
  },
});
