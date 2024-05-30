// Copyright 2018-2024 the Deno authors. All rights reserved. MIT license.
// This module is browser compatible.
import { AssertionError } from "./assertion_error.ts";
import { stripAnsiCode } from "@std/internal/styles";

export interface AssertIsErrorOptions<E> {
  /**
   * The optional error class to assert.
   */
  // deno-lint-ignore no-explicit-any
  errorClass?: new (...args: any[]) => E;
  /**
   * The optional string or RegExp to assert in the error message.
   */
  msgMatches?: string | RegExp;
  /**
   * The optional message to display if the assertion fails.
   */
  msg?: string;
}

/**
 * Make an assertion that `error` is an `Error`.
 * If not then an error will be thrown.
 * An error class and a string that should be included in the
 * error message can also be asserted.
 *
 * @example Usage
 * ```ts no-eval
 * import { assertIsError } from "@std/assert/assert-is-error";
 *
 * assertIsError(null); // Throws
 * assertIsError(new RangeError("Out of range")); // Doesn't throw
 * assertIsError(new RangeError("Out of range"), SyntaxError); // Throws
 * assertIsError(new RangeError("Out of range"), SyntaxError, "Out of range"); // Doesn't throw
 * assertIsError(new RangeError("Out of range"), SyntaxError, "Within range"); // Throws
 * ```
 *
 * @typeParam E The type of the error to assert.
 * @param options The options to assert.
 */
export function assertIsError<E extends Error = Error>(
  error: unknown,
  options: AssertIsErrorOptions<E> = {},
): asserts error is E {
  let { errorClass, msgMatches, msg } = options;

  const msgSuffix = msg ? `: ${msg}` : ".";
  if (!(error instanceof Error)) {
    throw new AssertionError(
      `Expected "error" to be an Error object${msgSuffix}}`,
    );
  }
  if (errorClass && !(error instanceof errorClass)) {
    msg =
      `Expected error to be instance of "${errorClass.name}", but was "${error?.constructor?.name}"${msgSuffix}`;
    throw new AssertionError(msg);
  }
  let msgCheck;
  if (typeof msgMatches === "string") {
    msgCheck = stripAnsiCode(error.message).includes(
      stripAnsiCode(msgMatches),
    );
  }
  if (msgMatches instanceof RegExp) {
    msgCheck = msgMatches.test(stripAnsiCode(error.message));
  }

  if (msgMatches && !msgCheck) {
    msg = `Expected error message to include ${
      msgMatches instanceof RegExp
        ? msgMatches.toString()
        : JSON.stringify(msgMatches)
    }, but got ${JSON.stringify(error?.message)}${msgSuffix}`;
    throw new AssertionError(msg);
  }
}
