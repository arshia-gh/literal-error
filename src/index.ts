import {
    CatchMetadata,
    CaughtError,
    ThrowsFunction,
    UnsafeResult,
    AnyFunction,
    Err,
} from './types';

export const throws: ThrowsFunction = <
    Task extends AnyFunction,
    Throwables extends Err[],
>(
        task: Task,
        ...throwables: Throwables
    ) => {
    return (...args: Parameters<Task>) => {
        try {
            return task(...args);
        } catch (error) {
            // TODO: use a user defined comapre function or compare references instead
            const found = throwables.find((throwable) =>
                compareThrowable(error, throwable),
            );
            return {
                throwable: found,
                __isMarkedByThrows: found != null,
            };
        }
    };
};

export const Catch = <E extends Err, Return>(
    err: E,
    callback: (err: E) => Return,
): CatchMetadata<E, Return> => {
    return {
        __isCatchMetadata: true,
        callback,
        throwable: err,
    };
};

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

export const isThrownError = (result: UnsafeResult): result is CaughtError => {
    return (
        result &&
        typeof result === 'object' &&
        '__isMarkedByThrows' in result &&
        typeof result.__isMarkedByThrows === 'boolean'
    );
};

export const compareThrowable = (e1: Err, e2: Err): boolean => {
    return e1.name === e2.name && e1.message === e2.message;
};

export const Try: TryFunction = <Result>(
    result: UnsafeResult<Result>,
    ...catchFunctions: CatchMetadata[]
): Result => {
    if (isThrownError(result)) {
        const { throwable } = result;
        if (throwable == null) throw throwable;

        const catchFunc = catchFunctions.find((meta) =>
            compareThrowable(meta.throwable, throwable),
        )?.callback;

        if (catchFunc == null) throw throwable;

        return catchFunc(throwable);
    }
    return result;
};
