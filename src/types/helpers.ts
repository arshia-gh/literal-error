import type { UnsafeResult, CaughtError } from './core';

export type Err = { name: string; message: string };

export type AnyFunction = (...args: any[]) => any;

export type ToSafeResult<Result extends UnsafeResult> = Exclude<Result, CaughtError>;

export type GetCaughtErrors<Result extends UnsafeResult> = Extract<Result, CaughtError>;

export type GetThrowables<Result extends UnsafeResult> =
    GetCaughtErrors<Result>['throwable'];
