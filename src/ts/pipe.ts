export function pipe<V, R1>(v: V, f1: (v: V) => R1): R1;
export function pipe<V, R1, R2>(v: V, f1: (v: V) => R1, f2: (v: R1) => R2): R2;
export function pipe<V, R1, R2, R3>(v: V, f1: (v: V) => R1, f2: (v: R1) => R2, f3: (v: R2) => R3): R3;
export function pipe<V, R1, R2, R3, R4>(
    v: V,
    f1: (v: V) => R1,
    f2: (v: R1) => R2,
    f3: (v: R2) => R3,
    f4: (v: R3) => R4
): R4;
export function pipe<V, R1, R2, R3, R4, R5>(
    v: V,
    f1: (v: V) => R1,
    f2: (v: R1) => R2,
    f3: (v: R2) => R3,
    f4: (v: R3) => R4,
    f5: (v: R4) => R5
): R5;
export function pipe<V, R1, R2, R3, R4, R5, R6>(
    v: V,
    f1: (v: V) => R1,
    f2: (v: R1) => R2,
    f3: (v: R2) => R3,
    f4: (v: R3) => R4,
    f5: (v: R4) => R5,
    f6: (v: R5) => R6
): R6;
export function pipe(...args: any[]) {
    const length = args.length;
    const value = args[0];
    switch (length) {
        case 2:
            return args[1](value);
        case 3:
            return args[2](args[1](value));
        case 4:
            return args[3](args[2](args[1](value)));
        case 5:
            return args[4](args[3](args[2](args[1](value))));
        case 6:
            return args[5](args[4](args[3](args[2](args[1](value)))));
        case 7:
            return args[6](args[5](args[4](args[3](args[2](args[1](value))))));
    }
}

export const givenPipe = <T>(val: T, ...funcs: ((val: T) => T)[]) => funcs.reduce((v, f) => f(v), val);

export type Given<T, U = T> = (value: T) => T;