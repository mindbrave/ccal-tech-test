import { curry } from "./curry";

export function map<A, B>(fn: (v: A) => B, arr: A[]): B[];
export function map<A, B>(fn: (v: A) => B): (arr: A[]) => B[];
export function map(...args: any): any {
    return (curry((fn: any, arr: any[]): any[] => arr.map(fn)) as any)(...args);
}