import { sum, getUniqueID, getFullApiUrl } from './index';

describe('sum', () => {
    test('first operand should be a number', () => {
        expect(() => sum('num', 2)).toThrowError('Operand 1 should be a number.');
    });

    test('second operand should be a number', () => {
        expect(() => sum(1, 'num')).toThrowError('Operand 2 should be a number.');
    });

    test('sum function should return 3 for 1 + 2', () => {
        expect(sum(1, 2)).toBe(3);
    });
});

describe('getUniqueID', () => {
    test('param should be a number', () => {
        expect(() => getUniqueID('num')).toThrowError('The function argument should be a number!');
    });

    test('function should return ID with length equal to 15 if no param passed', () => {
        expect(getUniqueID().length).toBe(15);
    });

    test('function should return a string', () => {
        expect(typeof getUniqueID()).toBe('string');
    });

    test('param specifies result length', () => {
        expect(getUniqueID(11).length).toBe(11);
    });
});

describe('getFullApiUrl', () => {
    test('first or second param should be a string', () => {
        expect(() => getFullApiUrl(1, 2)).toThrowError('\'api\' and \'GROUP_ID\' arguments passed should be a string!');
    });

    test('function should return an API URL', () => {
        expect(getFullApiUrl('www.google.com', 'search=react')).toBe('www.google.com/search=react');
    });
});