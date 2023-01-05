import { throws } from '../src';
import {
    NegativeNotAllowedError,
    OnlyNumberAllowedErr,
    PostiveNotAllowedError,
    throwsIfNegative,
    throwsIfNotStringZero,
    throwsIfNotZero,
    throwsIfPositive,
    toCaughtError,
} from './helpers';

describe('Throws function', () => {
    it('should return function (one error)', () => {
        const unsafeFunction = throws(throwsIfNegative, NegativeNotAllowedError);
        expect(typeof unsafeFunction).toBe('function');
    });

    it('should return function (two errors)', () => {
        const unsafeFunction = throws(
            throwsIfNotZero,
            NegativeNotAllowedError,
            PostiveNotAllowedError,
        );
        expect(typeof unsafeFunction).toBe('function');
    });

    it('should return function (three errors)', () => {
        const unsafeFunction = throws(
            throwsIfNotStringZero,
            OnlyNumberAllowedErr,
            NegativeNotAllowedError,
            PostiveNotAllowedError,
        );
        expect(typeof unsafeFunction).toBe('function');
    });
});

describe('Unsafe Function', () => {
    it('should return safe result if provided the correct input', () => {
        const unsafeFunction = throws(throwsIfNegative, NegativeNotAllowedError);
        const result = unsafeFunction(throwsIfNegative.safeInput);

        expect(typeof result).toBe(typeof throwsIfNegative.safeInput);
        expect(result).toBe(throwsIfNegative.safeInput);
    });

    it('should return caught error if provided the incorrect input', () => {
        const unsafeFunction = throws(throwsIfNegative, NegativeNotAllowedError);
        const result = unsafeFunction(throwsIfPositive.safeInput); // this will produce an error

        const expectedError = toCaughtError(NegativeNotAllowedError);

        expect(typeof result).toBe('object');
        expect(result).toHaveProperty(
            '__isMarkedByThrows',
            expectedError.__isMarkedByThrows,
        );
        expect(result).toHaveProperty('throwable', NegativeNotAllowedError);

        // remove this if the object doesn't need to have exactly the same shape
        expect(result).toStrictEqual(expectedError);
    });

    it('should return the correct caught error if provided the incorrect input', () => {
        const unsafeFunction = throws(
            throwsIfNotZero,
            NegativeNotAllowedError,
            PostiveNotAllowedError,
        );
        const resultE1 = unsafeFunction(throwsIfPositive.safeInput); // this will produce a NegativeNotAllowedError
        const resultE2 = unsafeFunction(throwsIfNegative.safeInput); // this will produce a PostiveNotAllowedError

        const caughtE1 = toCaughtError(NegativeNotAllowedError);
        const caughtE2 = toCaughtError(PostiveNotAllowedError);

        // for NegativeNotAllowedError
        expect(typeof resultE1).toBe('object');
        expect(resultE1).toHaveProperty(
            '__isMarkedByThrows',
            caughtE1.__isMarkedByThrows,
        );
        expect(resultE1).toHaveProperty('throwable', NegativeNotAllowedError);

        // remove this if the object doesn't need to have exactly the same shape
        expect(resultE1).toStrictEqual(caughtE1);

        // for PostiveNotAllowedError
        expect(typeof resultE2).toBe('object');
        expect(resultE2).toHaveProperty(
            '__isMarkedByThrows',
            caughtE2.__isMarkedByThrows,
        );
        expect(resultE2).toHaveProperty('throwable', PostiveNotAllowedError);

        // remove this if the object doesn't need to have exactly the same shape
        expect(resultE2).toStrictEqual(caughtE2);
    });
});
