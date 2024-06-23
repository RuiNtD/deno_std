// Ported from js-yaml v3.13.1:
// https://github.com/nodeca/js-yaml/commit/665aadda42349dcae869f12040d9b10ef18d12da
// Copyright 2011-2015 by Vitaly Puzrin. All rights reserved. MIT license.
// Copyright 2018-2024 the Deno authors. All rights reserved. MIT license.

import type { YAMLError } from "../_error.ts";
import type { TypeMap } from "../schema.ts";
import type { Type } from "../type.ts";
import type { Any, ArrayObject } from "../_utils.ts";
import { DEFAULT_SCHEMA } from "../schema/default.ts";

export interface LoaderStateOptions {
  legacy?: boolean;
  listener?: ((...args: Any[]) => void) | null;
  /** string to be used as a file path in error/warning messages. */
  filename?: string;
  /** compatibility with JSON.parse behaviour. */
  json?: boolean;
  /** function to call on warning messages. */
  onWarning?(this: null, e?: YAMLError): void;
}

// deno-lint-ignore no-explicit-any
export type ResultType = any[] | Record<string, any> | string;

export class LoaderState {
  input: string;
  documents: Any[] = [];
  length: number;
  lineIndent = 0;
  lineStart = 0;
  position = 0;
  line = 0;
  filename?: string;
  onWarning?: (...args: Any[]) => void;
  legacy: boolean;
  json: boolean;
  listener?: ((...args: Any[]) => void) | null;
  implicitTypes: Type[];
  typeMap: TypeMap;

  version?: string | null;
  checkLineBreaks?: boolean;
  tagMap?: ArrayObject;
  anchorMap?: ArrayObject;
  tag?: string | null;
  anchor?: string | null;
  kind?: string | null;
  result: ResultType | null = "";

  constructor(
    input: string,
    {
      filename,
      onWarning,
      legacy = false,
      json = false,
      listener = null,
    }: LoaderStateOptions,
  ) {
    this.input = input;
    this.filename = filename;
    this.onWarning = onWarning;
    this.legacy = legacy;
    this.json = json;
    this.listener = listener;

    this.implicitTypes = DEFAULT_SCHEMA.compiledImplicit;
    this.typeMap = DEFAULT_SCHEMA.compiledTypeMap;

    this.length = input.length;
  }
}
