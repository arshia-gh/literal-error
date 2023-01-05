import { CaughtError, Err } from '../src/types';

export const NegativeNotAllowedError = {
    name: 'NegativeNotAllowed',
    message: 'negative number is not allowed',
} as const satisfies Err;

export const PostiveNotAllowedError = {
    name: 'PostiveNotAllowed',
    message: 'positive number is not allowed',
} as const satisfies Err;

export const OnlyNumberAllowedErr = {
    name: 'OnlyNumberAllowed',
    message: 'only number is allowed',
} as const satisfies Err;

export const throwsIfNegative = (num: number) => {
    if (num < 0) throw NegativeNotAllowedError;
    return num;
};

throwsIfNegative.safeInput = 10;

export const throwsIfPositive = (num: number) => {
    if (num > 0) throw PostiveNotAllowedError;
    return num;
};

throwsIfPositive.safeInput = -10;

export const throwIfNotNumber = (input: string) => {
    const num = parseInt(input);
    if (Number.isNaN(num)) throw OnlyNumberAllowedErr;
    return num;
};

throwIfNotNumber.safeInput = '10';

/**
 * This function can throw NegativeNotAllowedError or PostiveNotAllowedError
 */
export const throwsIfNotZero = (num: number) => {
    throwsIfNegative(num);
    throwsIfPositive(num);
    return num;
};

throwsIfNotZero.safeInput = 0;

export const throwsIfNotStringZero = (input: string) => {
    const num = throwIfNotNumber(input);
    throwsIfNegative(num);
    throwsIfPositive(num);
    return num;
};

throwsIfNotStringZero.safeInput = '0';

export const toCaughtError = <E extends Err>(
    err: E,
    shouldBeMarked = true,
): CaughtError<E> => {
    return {
        __isMarkedByThrows: shouldBeMarked,
        throwable: err,
    };
};
