export type Err = { name: string; message: string };

export type AnyFunction = (...args: any[]) => any;

export type CaughtError<E extends Err = Err> = {
    throwable: E;
    __isMarkedByThrows: boolean;
};

export type CatchFunction<E extends Err, R> = (
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

export type ToSafeResult<Result extends UnsafeResult> = Exclude<Result, CaughtError>;

export type GetCaughtErrors<Result extends UnsafeResult> = Extract<Result, CaughtError>;

export type GetThrowables<Result extends UnsafeResult> =
    GetCaughtErrors<Result>['throwable'];

export type Throws = {
    <Task extends AnyFunction, E1 extends Err>(
        task: Task,
        ...throwables: [E1]
    ): UnsafeFunction<typeof task, typeof throwables>;
    <Task extends AnyFunction, E1 extends Err, E2 extends Err>(
        task: Task,
        ...throwables: [E1, E2]
    ): UnsafeFunction<typeof task, typeof throwables>;
    <Task extends AnyFunction, E1 extends Err, E2 extends Err, E3 extends Err>(
        task: Task,
        ...throwables: [E1, E2, E3]
    ): UnsafeFunction<typeof task, typeof throwables>;
    <
        Task extends AnyFunction,
        E1 extends Err,
        E2 extends Err,
        E3 extends Err,
        E4 extends Err,
    >(
        task: Task,
        ...throwables: [E1, E2, E3, E4]
    ): UnsafeFunction<typeof task, typeof throwables>;
};

export const throws: Throws = <Args extends [], Return>(
    task: (...args: Args) => Return,
    ...throwables: Err[]
) => {
    return (...args: Args) => {
        try {
            return task(...args);
        } catch (error) {
            return {
                throwable: throwables.find((throwable) => throwable === error),
                __isMarkedByThrows: true,
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
