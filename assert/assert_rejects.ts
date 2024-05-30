// Copyright 2018-2024 the Deno authors. All rights reserved. MIT license.
// This module is browser compatible.
import { AssertionError } from "./assertion_error.ts";
import { assertIsError } from "./assert_is_error.ts";

/** Options for {@linkcode assertRejects}. */
export interface AssertRejectsOptions<E extends Error = Error> {
  /**
   * The error class to assert.
   */
  // deno-lint-ignore no-explicit-any
  errorClass?: new (...args: any[]) => E;
  /**
   * The string that should be included in the error message.
   */
  msgIncludes?: string;
  /**
   * The optional message to display if the assertion fails.
   */
  msg?: string;
}

/**
 * Executes a function which returns a promise, expecting it to reject.
 * If it does not, then it throws. An error class and a string that should be
 * included in the error message can also be asserted.
 *
 * To assert that a synchronous function throws, use {@linkcode assertThrows}.
 *
 * @example Usage
 * ```ts no-eval
 * import { assertRejects } from "@std/assert/assert-rejects";
 *
 * await assertRejects(async () => Promise.reject(new Error()), Error); // Doesn't throw
 * await assertRejects(async () => Promise.reject(new Error()), SyntaxError); // Throws
 * ```
 *
 * @typeParam E The error class to assert.
 * @param options Options for the assertion.
 * @returns The promise which resolves to the thrown error.
 */
export async function assertRejects<E extends Error = Error>(
  fn: () => PromiseLike<unknown>,
  options: AssertRejectsOptions<E> = {},
): Promise<E | Error | unknown> {
  const {
    errorClass,
    msgIncludes,
    msg,
  } = options;

  let doesThrow = false;
  let isPromiseReturned = false;
  const msgSuffix = msg ? `: ${msg}` : ".";
  let err;
  try {
    const possiblePromise = fn();
    if (
      possiblePromise &&
      typeof possiblePromise === "object" &&
      typeof possiblePromise.then === "function"
    ) {
      isPromiseReturned = true;
      await possiblePromise;
    } else {
      throw Error();
    }
  } catch (error) {
    if (!isPromiseReturned) {
      throw new AssertionError(
        `Function throws when expected to reject${msgSuffix}`,
      );
    }
    if (errorClass) {
      if (!(error instanceof Error)) {
        throw new AssertionError(`A non-Error object was rejected${msgSuffix}`);
      }
      assertIsError(
        error,
        errorClass,
        msgIncludes,
        msg,
      );
    }
    err = error;
    doesThrow = true;
  }
  if (!doesThrow) {
    throw new AssertionError(
      `Expected function to reject${msgSuffix}`,
    );
  }
  return err;
}
