import type { Err, AnyFunction } from './helpers';

export type CaughtError<E extends Err = Err> = {
    throwable: E;
    __isMarkedByThrows: boolean;
};

export type CatchFunction = <E extends Err, R>(
    err: E,
    callback: (err: E) => R,
) => CatchMetadata<E, R>;

export type CatchMetadata<E extends Err = Err, R = any> = {
    throwable: E;
    callback: (err: E) => R;
    __isCatchMetadata: true;
};

export type UnsafeFunction<
    Task extends AnyFunction = AnyFunction,
    Throwables extends Err[] = Err[],
> = (...args: Parameters<Task>) => UnsafeResult<ReturnType<Task>, Throwables>;

export type UnsafeResult<Type = any, Throwables extends Err[] = Err[]> =
    | Type
    | CaughtError<Throwables[number]>;

export type ThrowsFunction = <Task extends AnyFunction, Throwables extends Err[]>(
    task: Task,
    ...throwables: Throwables
) => UnsafeFunction<Task, Throwables>;

export type TryFunction = {
    <E1 extends Err, E1Result, Result>(
        result: UnsafeResult<Result, [E1]>,
        ...catchFunctions: [CatchMetadata<E1, E1Result>]
    ): Result | E1Result;
    <E1 extends Err, E1Result, E2 extends Err, E2Result, Result>(
        result: UnsafeResult<Result, [E1, E2]>,
        ...catchFunctions: [CatchMetadata<E1, E1Result>, CatchMetadata<E2, E2Result>]
    ): Result | E1Result | E2Result;
    <
        E1 extends Err,
        E1Result,
        E2 extends Err,
        E2Result,
        E3 extends Err,
        E3Result,
        Result,
    >(
        result: UnsafeResult<Result, [E1, E2, E3]>,
        ...catchFunctions: [
            CatchMetadata<E1, E1Result>,
            CatchMetadata<E2, E2Result>,
            CatchMetadata<E3, E3Result>,
        ]
    ): Result | E1Result | E2Result | E3Result;

    <
        E1 extends Err,
        E1Result,
        E2 extends Err,
        E2Result,
        E3 extends Err,
        E3Result,
        E4 extends Err,
        E4Result,
        Result,
    >(
        result: UnsafeResult<Result, [E1, E2, E3, E4]>,
        ...catchFunctions: [
            CatchMetadata<E1, E1Result>,
            CatchMetadata<E2, E2Result>,
            CatchMetadata<E3, E3Result>,
            CatchMetadata<E4, E4Result>,
        ]
    ): Result | E1Result | E2Result | E3Result | E4Result;
};
