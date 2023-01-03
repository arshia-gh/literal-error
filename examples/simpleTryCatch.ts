import { Try, Catch, throws } from '../src';

const NegativeNotAllowed = {
    name: 'NegativeNotAllowed',
    message: 'Negative number is not allowed',
} as const;

const throwIfNegative = throws((num: number) => {
    if (num < 0) throw NegativeNotAllowed;
    return num;
}, NegativeNotAllowed);

const result = Try(
    throwIfNegative(10),
    Catch(NegativeNotAllowed, (err) => err.message),
);

console.log(result);
