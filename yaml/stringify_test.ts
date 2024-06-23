// Ported from js-yaml v3.13.1:
// https://github.com/nodeca/js-yaml/commit/665aadda42349dcae869f12040d9b10ef18d12da
// Copyright 2011-2015 by Vitaly Puzrin. All rights reserved. MIT license.
// Copyright 2018-2024 the Deno authors. All rights reserved. MIT license.

import { assertEquals, assertThrows } from "@std/assert";
import { stringify } from "./stringify.ts";
import { YAMLError } from "./_error.ts";

Deno.test({
  name: "stringify()",
  fn() {
    const FIXTURE = {
      foo: {
        bar: true,
        test: [
          "a",
          "b",
          {
            a: false,
          },
          {
            a: false,
          },
        ],
      },
      test: "foobar",
      binary: new Uint8Array([72, 101, 108, 108, 111]),
    };

    const ASSERTS = `foo:
  bar: true
  test:
    - a
    - b
    - a: false
    - a: false
test: foobar
binary: !<tag:yaml.org,2002:binary> SGVsbG8=
`;

    assertEquals(stringify(FIXTURE), ASSERTS);
  },
});

Deno.test({
  name: "arrays can be stringified directly",
  fn() {
    const array = [1, 2, 3];

    const expected = "- 1\n- 2\n- 3\n";

    assertEquals(stringify(array), expected);
  },
});

Deno.test({
  name: "strings can be stringified directly",
  fn() {
    const string = "Hello world";

    const expected = "Hello world\n";

    assertEquals(stringify(string), expected);
  },
});

Deno.test({
  name: "numbers can be stringified directly",
  fn() {
    const number = 1.01;

    const expected = "1.01\n";

    assertEquals(stringify(number), expected);
  },
});

Deno.test({
  name: "booleans can be stringified directly",
  fn() {
    const boolean = true;

    const expected = "true\n";

    assertEquals(stringify(boolean), expected);
  },
});

Deno.test({
  name: "stringify() throws with `!!js/*` yaml types with default schemas",
  fn() {
    const object = { undefined: undefined };
    assertThrows(
      () => stringify(object),
      YAMLError,
      "unacceptable kind of an object to dump",
    );
  },
});

Deno.test({
  name: "stringify() handles float types",
  fn() {
    const floats = [
      4.1,
      -1.473,
      6.82e-5,
      6.82e-12,
      5e-12,
      0,
      -0,
    ];
    assertEquals(
      stringify(floats),
      `- 4.1
- -1.473
- 0.0000682
- 6.82e-12
- 5.e-12
- 0
- -0.0
`,
    );
    const infNaN = [Infinity, -Infinity, NaN];
    assertEquals(
      stringify(infNaN),
      `- .inf
- -.inf
- .nan
`,
    );
    assertEquals(
      stringify(infNaN, { styles: { "tag:yaml.org,2002:float": "uppercase" } }),
      `- .INF
- -.INF
- .NAN
`,
    );
    assertEquals(
      stringify(infNaN, { styles: { "tag:yaml.org,2002:float": "camelcase" } }),
      `- .Inf
- -.Inf
- .NaN
`,
    );
  },
});
