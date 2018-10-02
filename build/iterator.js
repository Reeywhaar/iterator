"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Makes new Iterator.
 */
class Iterator {
    constructor(it) {
        if (Array.isArray(it)) {
            it = it[Symbol.iterator]();
        }
        if (typeof it.next !== "function") {
            if (typeof it[Symbol.iterator] !== "function") {
                throw new Error("Input is not iterable");
            }
            it = it[Symbol.iterator]();
        }
        if (typeof it.next !== "function") {
            throw new Error("Input is not iterable");
        }
        this.it = it;
    }
    *[Symbol.iterator]() {
        yield* this.it;
    }
    next(value) {
        return this.it.next(value);
    }
    /**
     * Transforms iterator to array.
     * Be aware with infinite iterators
     */
    toArray() {
        const arr = [];
        for (let item of this.it) {
            arr.push(item);
        }
        return arr;
    }
    /**
     * Mutates given iterator
     *
     * @example
     * range(0,5).pipe(function* (it){
     *   for(let i of it){
     *     yield i*2;
     *   }
     * }) // [0,2,4,6,8]
     */
    pipe(gen) {
        return new this.constructor(gen(this.it));
    }
    /**
     * Maps over iterator values
     *
     * @param fn - map function
     * @example
     * range(0,5).map(x => x*2) // [0,2,4,6,8]
     */
    map(fn) {
        let t = this.it;
        const it = function* () {
            let i = 0;
            for (let item of t) {
                yield fn(item, i);
                i++;
            }
        };
        return new this.constructor(it());
    }
    /**
     * Executes function over iterator item.
     * Be aware that iterator will be consumed after this.
     *
     * @param fn - function that will be executed with each item
     * @example
     * const arr = [];
     * range(0,5).forEach(x => arr.push(x*2))
     * arr; // [0,2,4,6,8]
     */
    forEach(fn) {
        let i = 0;
        for (let item of this.it) {
            fn(item, i);
            i++;
        }
    }
    /**
     * Filters iterator values
     *
     * @param fn - filter function
     * @example
     * range(0,5).filter(x => x%2 === 0) // [0,2,4]
     */
    filter(fn) {
        const t = this.it;
        const it = function* () {
            let i = 0;
            for (let item of t) {
                if (fn(item, i))
                    yield item;
                i++;
            }
        };
        return new this.constructor(it());
    }
    /**
     * Reduces iterator
     *
     * @param fn - reduce function
     * @param initial - initial value, if not presented, initial value will be the first item of iterator
     * @example
     * range(0,5).reduce((c,x) => c+x) // 10
     */
    reduce(fn, initial = undefined) {
        let i = 0;
        if (typeof initial === "undefined") {
            const val = this.it.next();
            i++;
            if (val.done) {
                throw new Error("reduce of empty iterator with no initial value");
            }
            initial = val.value;
        }
        for (let item of this.it) {
            initial = fn(initial, item, i);
            i++;
        }
        return initial;
    }
    /**
     * Enumerates iterator
     *
     * @example
     * range(1,5).enumerate() // [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5]]
     */
    enumerate() {
        const t = this.it;
        const it = function* () {
            let i = 0;
            for (let item of t) {
                yield [i, item];
                i++;
            }
        };
        return new this.constructor(it());
    }
    /**
     * Takes first n items of iterator
     *
     * @param count - items to take
     * @example
     * range(0,5).take(2) // [0,1]
     */
    take(count) {
        return this.while((x, i) => i < count);
    }
    /**
     * Skips first n items of iterator
     *
     * @param count - items to skip
     * @example
     * range(0,5).skip(2) // [2,3,4]
     */
    skip(count) {
        return this.filter((x, i) => i >= count);
    }
    /**
     * Yields while fn is true
     *
     * @param fn - function to check items
     * @example
     * range(0,5).while(x => x < 3) // [0,1,2]
     */
    while(fn) {
        const t = this.it;
        const it = function* () {
            let i = 0;
            for (let item of t) {
                if (!fn(item, i))
                    break;
                yield item;
                i++;
            }
        };
        return new this.constructor(it());
    }
    /**
     * Takes every nth items of iterator
     *
     * @param modulus - items with index divided by this number will be yielded
     * @example
     * range(0,5).everyNth(2) // [0,2,4]
     */
    everyNth(n) {
        return this.filter((x, i) => i % n === 0);
    }
    /**
     * Takes even items of iterator
     *
     * @example
     * range(0,5).even() // [0,2,4]
     */
    even() {
        return this.everyNth(2);
    }
    /**
     * Takes odd items of iterator
     *
     * @example
     * range(0,5).odd() // [1,3,5]
     */
    odd() {
        return this.skip(1).everyNth(2);
    }
    /**
     * Concats multiple iterators
     *
     * @param iters - iterators to take
     * @example
     * Iterator.fromArray([0,1,2])
     * .concat(Iterator.fromArray(["a","b","c"])) // [[0,1,2,"a","b","c"]]
     */
    concat(...iters) {
        const t = this.it;
        const it = function* () {
            yield* t;
            for (let iter of iters)
                yield* iter;
        };
        return new this.constructor(it());
    }
    /**
     * Prepends multiple iterators
     *
     * @param iters - iterators to take
     * @example
     * Iterator.fromArray([0,1,2])
     * .concatLeft(Iterator.fromArray(["a","b","c"])) // [["a","b","c",0,1,2]]
     */
    concatLeft(...iters) {
        const t = this.it;
        const it = function* () {
            for (let iter of iters)
                yield* iter;
            yield* t;
        };
        return new this.constructor(it());
    }
    /**
     * Merges multiple iterators
     *
     * @param iters - iterators to take
     * @example
     * Iterator.fromArray([0,1,2])
     * .merge(Iterator.fromArray(["a","b","c"])) // [[0,"a",1,"b",2,"c"]]
     */
    merge(...iters) {
        return this.constructor.fromMultiple(this.it, ...iters);
    }
    /**
     * Merges multiple iterators from left
     *
     * @param iters - iterators to take
     * @example
     * Iterator.fromArray([0,1,2])
     * .mergeLeft(Iterator.fromArray(["a","b","c"])) // [["a",0,"b",1,"c",2]]
     */
    mergeLeft(...iters) {
        return this.constructor.fromMultiple(...iters, this
            .it);
    }
    /**
     * Accumulates multiple items until closure return true
     *
     * @param fn - comparison function
     * @param yieldRest - specifies will iterator yield rest of values
     * @example
     * Iterator.fromArray(["a","b","c","a","b","c"])
     * .accumulateWhile((c,x)=> x === "c") // [["a","b","c"],["a","b","c"]]
     */
    accumulateWhile(fn, yieldRest = false) {
        const t = this.it;
        const it = function* () {
            let step = t.next();
            let arr = [];
            let i = 0;
            while (!step.done) {
                arr.push(step.value);
                if (fn(arr, step.value, i)) {
                    yield arr;
                    arr = [];
                }
                step = t.next();
                i++;
            }
            if (arr.length > 0 && yieldRest) {
                yield arr;
            }
        };
        return new this.constructor(it());
    }
    /**
     * Accumulates multiple items of iterator into one
     *
     * @param n - items to take
     * @param yieldRest - specifies will iterator yield the rest of values if iterator length wasn't divisible by modulus
     * @example
     * range(0,5).accumulateN(2, true) // [[0,1],[2,3],[4]]
     */
    accumulateN(n, yieldRest = false) {
        return this.accumulateWhile(c => c.length === n, yieldRest);
    }
    /**
     * Subsplits iterator items and subyields them
     *
     * @param generator
     * @example
     * Iterator.fromArray(["ab", "cd"]).subSplit(function*(item){
     * 	for(let char of item){
     * 		yield item
     * 	}
     * }) // ["a", "b", "c", "d"]
     */
    subSplit(gen) {
        const t = this.it;
        const it = function* () {
            for (let item of t)
                yield* gen(item);
        };
        return new this.constructor(it());
    }
    /**
     * Joins values with delimiter
     *
     * @param delimiter - delimiter (default: "")
     * @example
     * Iterator.fromArray(["ab", "cd"]).join() // "abcd"
     * Iterator.fromArray(["ab", "cd"]).join(" ") // "ab cd"
     */
    join(delimiter = "") {
        return this.toArray().join(delimiter);
    }
    /**
     * Creates new Iterator from iterator
     *
     * @param iter - iterator
     */
    static new(iter) {
        return new this(iter);
    }
    /**
     * Makes Iterator from array
     *
     * @param arr - array
     */
    static fromArray(arr) {
        const it = function* () {
            for (let item of arr)
                yield item;
        };
        return new this(it.call(this));
    }
    /**
     * Makes Iterator from array
     *
     * @param iters - iterators
     * @example
     * Iterator.fromMultiple(
     * 	Iterator.fromArray([1,2,3]),
     * 	Iterator.fromArray(["a","b","c"]),
     * ).toArray() // [1,"a","2","b",3,"c"]
     */
    static fromMultiple(...iters) {
        const itersCopy = iters.slice(0);
        const it = function* () {
            while (itersCopy.length > 0) {
                for (let it of itersCopy) {
                    let step = it.next();
                    if (!step.done) {
                        yield step.value;
                    }
                    else {
                        itersCopy.splice(itersCopy.indexOf(it), 1);
                    }
                }
            }
        };
        return new this(it.call(this));
    }
    /**
     * Generates range
     *
     * If n.length === 1 then range is (0, n[0] - 1),
     *
     * if n.length === 2 then range is (n[0], n[1]),
     *
     * if n.length === 3, then range is (n[0], n[1]) wisth step(n[2])
     * @example
     * Iterator.range(5) -> [0,1,2,3,4]
     */
    static range(...n) {
        const it = function* (...n) {
            let start = 0;
            let end = 9;
            let step = 1;
            if (n.length === 1)
                end = n[0] - 1;
            if (n.length > 1) {
                start = n[0];
                end = n[1];
            }
            if (n.length > 2) {
                step = n[2];
                if (step < 1)
                    throw new Error("step must be positive");
            }
            const delta = Math.floor(Math.abs(end - start) / step);
            if (end < start) {
                step = step * -1;
            }
            for (let i = 0; i <= delta; i++) {
                yield start + i * step;
            }
        };
        return new this(it(...n));
    }
    /**
     * Generates counter
     *
     * @param step - step.
     * @example
     * Iterator.counter() -> [0,1,2,3,4...]
     * Iterator.counter(2) -> [0,2,4,6,8...]
     */
    static counter(step = 1) {
        const it = function* (step) {
            let i = 0;
            while (true) {
                yield i;
                i += step;
            }
        };
        return new this(it(step));
    }
}
exports.default = Iterator;
