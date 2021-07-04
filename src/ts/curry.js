
function curry(fn) {
    const argN = fn.length;
    return function (...args) {
        if (args.length < argN) {
            return curry(fn.bind(fn, ...args));
        } else {
            return fn.call(fn, ...args);
        }
    }
}

module.exports = {
    curry: curry
}
