import {
    CatchMetadata,
    CaughtError,
    ThrowsFunction,
    UnsafeResult,
    AnyFunction,
    Err,
    CatchFunction,
    TryFunction,
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

export const Catch: CatchFunction = <E extends Err, R>(
    err: E,
    callback: (err: E) => R,
): CatchMetadata<E, R> => {
    return {
        __isCatchMetadata: true,
        callback,
        throwable: err,
    };
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
