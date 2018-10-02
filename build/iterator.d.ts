/**
 * Makes new Iterator.
 */
export default class Iterator<T> implements Iterable<T> {
    /**
     * internal iterator
     */
    it: IterableIterator<T>;
    constructor(it: IterableIterator<T> | T[]);
    [Symbol.iterator](): IterableIterator<T>;
    next(value: any): IteratorResult<T>;
    /**
     * Transforms iterator to array.
     * Be aware with infinite iterators
     */
    toArray(): T[];
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
    pipe<U>(gen: (val: IterableIterator<T>) => IterableIterator<U>): Iterator<U>;
    /**
     * Maps over iterator values
     *
     * @param fn - map function
     * @example
     * range(0,5).map(x => x*2) // [0,2,4,6,8]
     */
    map<U>(fn: (value: T, index: number) => U): Iterator<U>;
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
    forEach(fn: (value: T, index: number) => void): void;
    /**
     * Filters iterator values
     *
     * @param fn - filter function
     * @example
     * range(0,5).filter(x => x%2 === 0) // [0,2,4]
     */
    filter(fn: (value: T, index: number) => boolean): Iterator<T>;
    /**
     * Reduces iterator
     *
     * @param fn - reduce function
     * @param initial - initial value, if not presented, initial value will be the first item of iterator
     * @example
     * range(0,5).reduce((c,x) => c+x) // 10
     */
    reduce<U>(fn: (initial: U, value: T, index: number) => U, initial?: U | undefined): U;
    /**
     * Enumerates iterator
     *
     * @example
     * range(1,5).enumerate() // [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5]]
     */
    enumerate(): Iterator<[number, T]>;
    /**
     * Takes first n items of iterator
     *
     * @param count - items to take
     * @example
     * range(0,5).take(2) // [0,1]
     */
    take(count: number): Iterator<T>;
    /**
     * Skips first n items of iterator
     *
     * @param count - items to skip
     * @example
     * range(0,5).skip(2) // [2,3,4]
     */
    skip(count: number): Iterator<T>;
    /**
     * Yields while fn is true
     *
     * @param fn - function to check items
     * @example
     * range(0,5).while(x => x < 3) // [0,1,2]
     */
    while(fn: (value: T, index: number) => boolean): Iterator<T>;
    /**
     * Takes every nth items of iterator
     *
     * @param modulus - items with index divided by this number will be yielded
     * @example
     * range(0,5).everyNth(2) // [0,2,4]
     */
    everyNth(n: number): Iterator<T>;
    /**
     * Takes even items of iterator
     *
     * @example
     * range(0,5).even() // [0,2,4]
     */
    even(): Iterator<T>;
    /**
     * Takes odd items of iterator
     *
     * @example
     * range(0,5).odd() // [1,3,5]
     */
    odd(): Iterator<T>;
    /**
     * Concats multiple iterators
     *
     * @param iters - iterators to take
     * @example
     * Iterator.fromArray([0,1,2])
     * .concat(Iterator.fromArray(["a","b","c"])) // [[0,1,2,"a","b","c"]]
     */
    concat<U>(...iters: IterableIterator<U>[]): Iterator<T | U>;
    /**
     * Prepends multiple iterators
     *
     * @param iters - iterators to take
     * @example
     * Iterator.fromArray([0,1,2])
     * .concatLeft(Iterator.fromArray(["a","b","c"])) // [["a","b","c",0,1,2]]
     */
    concatLeft<U>(...iters: IterableIterator<U>[]): Iterator<T | U>;
    /**
     * Merges multiple iterators
     *
     * @param iters - iterators to take
     * @example
     * Iterator.fromArray([0,1,2])
     * .merge(Iterator.fromArray(["a","b","c"])) // [[0,"a",1,"b",2,"c"]]
     */
    merge<U>(...iters: IterableIterator<U>[]): Iterator<T | U>;
    /**
     * Merges multiple iterators from left
     *
     * @param iters - iterators to take
     * @example
     * Iterator.fromArray([0,1,2])
     * .mergeLeft(Iterator.fromArray(["a","b","c"])) // [["a",0,"b",1,"c",2]]
     */
    mergeLeft<U>(...iters: IterableIterator<U>[]): Iterator<T | U>;
    /**
     * Accumulates multiple items until closure return true
     *
     * @param fn - comparison function
     * @param yieldRest - specifies will iterator yield rest of values
     * @example
     * Iterator.fromArray(["a","b","c","a","b","c"])
     * .accumulateWhile((c,x)=> x === "c") // [["a","b","c"],["a","b","c"]]
     */
    accumulateWhile(fn: (carry: T[], value: T, index: number) => boolean, yieldRest?: boolean): Iterator<T[]>;
    /**
     * Accumulates multiple items of iterator into one
     *
     * @param n - items to take
     * @param yieldRest - specifies will iterator yield the rest of values if iterator length wasn't divisible by modulus
     * @example
     * range(0,5).accumulateN(2, true) // [[0,1],[2,3],[4]]
     */
    accumulateN(n: number, yieldRest?: boolean): Iterator<T[]>;
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
    subSplit<U>(gen: (value: T) => IterableIterator<U>): Iterator<U>;
    /**
     * Joins values with delimiter
     *
     * @param delimiter - delimiter (default: "")
     * @example
     * Iterator.fromArray(["ab", "cd"]).join() // "abcd"
     * Iterator.fromArray(["ab", "cd"]).join(" ") // "ab cd"
     */
    join(delimiter?: string): string;
    /**
     * Creates new Iterator from iterator
     *
     * @param iter - iterator
     */
    static new<T>(iter: IterableIterator<T> | T[]): Iterator<T>;
    /**
     * Makes Iterator from array
     *
     * @param arr - array
     */
    static fromArray<T>(arr: T[]): Iterator<T>;
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
    static fromMultiple<T>(...iters: IterableIterator<T>[]): Iterator<T>;
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
    static range(...n: number[]): Iterator<number>;
    /**
     * Generates counter
     *
     * @param step - step.
     * @example
     * Iterator.counter() -> [0,1,2,3,4...]
     * Iterator.counter(2) -> [0,2,4,6,8...]
     */
    static counter(step?: number): Iterator<number>;
}
