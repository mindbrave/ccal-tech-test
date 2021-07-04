

export type Maybe<T> = T | null;

export const isNil = <T>(v: T | null | undefined): v is null | undefined => v === null || v === undefined;

export const from = <T>(v: T): Maybe<T> => (isNil(v) ? null : v);

export const map = <A, B>(fn: (v: A) => B) => (maybe: Maybe<A>): Maybe<B> => (isNil(maybe) ? maybe : fn(maybe));

export const toBool = <A>(maybe: Maybe<A>): boolean => (isNil(maybe) ? false : !!maybe);

export const isNothing = <A>(maybe: Maybe<A>): maybe is null => (isNil(maybe) ? true : false);

export const withDefault = <V>(defaultValue: V) => (maybe: Maybe<V>): V => (isNil(maybe) ? defaultValue : maybe);

export const flatten = <T>(v: Maybe<Maybe<T>>): Maybe<T> => v;