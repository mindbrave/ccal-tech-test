
export enum ResultType {
    Success = 'Succes',
    Failure = 'Failure',
}

export type Success<V> = {
    type: ResultType.Success;
    value: V;
};

export type Failure<ERR> = {
    type: ResultType.Failure;
    error: ERR;
};

export type Result<V, ERR> = Success<V> | Failure<ERR>;

export const success = <V>(value: V): Success<V> => ({
    type: ResultType.Success,
    value: value,
});

export const failure = <ERR>(error: ERR): Failure<ERR> => ({
    type: ResultType.Failure,
    error: error,
});

export const map = <A, B, ERR>(fn: (v: A) => B) => (result: Result<A, ERR>): Result<B, ERR> => {
    switch (result.type) {
        case ResultType.Success:
            return success(fn(result.value));

        case ResultType.Failure:
            return result;
    }
};

export const andThen = <A, B, ERR>(fn: (v: A) => Result<B, ERR>) => (result: Result<A, ERR>): Result<B, ERR> => {
    switch (result.type) {
        case ResultType.Success:
            return fn(result.value);

        case ResultType.Failure:
            return result;
    }
}

export const withDefault = <A, ERR>(defaultValue: A) => (result: Result<A, ERR>): A => {
    switch (result.type) {
        case ResultType.Success:
            return result.value;

        case ResultType.Failure:
            return defaultValue;
    }
};

export const Result = {
    success,
    failure,
    map,
    withDefault,
    andThen,
};