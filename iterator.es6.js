/**
 * Makes new Iterator.
 * @constructor
 * @param {iterator} gen - iterator
 */
function Iterator(gen) {
	this.gen = gen;
}

Iterator.prototype[Symbol.iterator] = function*() {
	yield* this.gen;
};

Iterator.prototype.next = function(value) {
	return this.gen.next(value);
};

/**
 * Transform iterator to array.
 * Be aware with infinite iterators
 *
 * @returns {Any[]}
 */
Iterator.prototype.toArray = function() {
	let arr = [];
	for (let item of this.gen) {
		arr.push(item);
	}
	return arr;
};

/**
 * function which Iterator instance mepthod consumes
 *
 * @typedef mapFunction
 * @param {*} item - iterator item
 * @param {number} index - item index
 * @return *
 */

/**
 * Map over iterator values
 *
 * @param {mapFunction} fn - function to transform values
 * @returns {Iterator}
 * @example
 * range(0,5).map(x => x*2) // [0,2,4,6,8]
 */
Iterator.prototype.map = function(fn) {
	const it = function*() {
		let i = 0;
		for (let item of this.gen) {
			yield fn(item, i);
			i++;
		}
	};
	return new Iterator(it.call(this));
};

/**
 * Executes function over iterator item.
 * Be aware that iterator will be consumed after this.
 *
 * @param {mapFunction} fn - function to transform values
 * @returns {void}
 * @example
 * const arr = [];
 * range(0,5).forEach(x => arr.push(x*2))
 * arr; // [0,2,4,6,8]
 */
Iterator.prototype.forEach = function(fn) {
	let i = 0;
	for (let item of this.gen) {
		fn(item, i);
		i++;
	}
};

/**
 * function which Iterator instance mepthod consumes
 *
 * @typedef filterFunction
 * @param {*} item - iterator item
 * @param {number} index - item index
 * @return {boolean}
 */

/**
 * Filter iterator values
 *
 * @param {filterFunction} fn - function to transform values
 * @returns {Iterator}
 * @example
 * range(0,5).filter(x => x%2 === 0) // [0,2,4]
 */
Iterator.prototype.filter = function(fn) {
	const it = function*() {
		let i = 0;
		for (let item of this.gen) {
			if (fn(item, i)) yield item;
			i++;
		}
	};
	return new Iterator(it.call(this));
};

/**
 * function which Iterator instance method consumes
 *
 * @typedef reduceFunction
 * @param {*} carry - accumulator
 * @param {*} item - iterator item
 * @param {number} index - item index
 * @return {*}
 */

/**
 * Reduce iterator
 *
 * @param {reduceFunction} fn - function to reduce iterator
 * @param {*=} initialValue - initial value of accumulator. if not provided then first item of iterator will be used
 * @returns {*}
 * @example
 * range(0,5).reduce((c,x) => c+x) // 10
 */
Iterator.prototype.reduce = function(fn, initial) {
	let obj = initial;
	let i = 0;
	if (typeof obj === "undefined") {
		const val = this.gen.next();
		i++;
		if (val.done) {
			throw new Error("reduce of empty iterator with no initial value");
		}
		obj = val.value;
	}
	for (let item of this.gen) {
		obj = fn(obj, item, i);
		i++;
	}
	return obj;
};

/**
 * Enumerate iterator
 *
 * @returns {Iterator}
 * @example
 * range(1,5).enumerate() // [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5]]
 */
Iterator.prototype.enumerate = function() {
	const it = function*() {
		let i = 0;
		for (let item of this.gen) {
			yield [i, item];
			i++;
		}
	};
	return new Iterator(it.call(this));
};

/**
 * Take first n items of iterator
 *
 * @param {number} count - items to take
 * @returns {Iterator}
 * @example
 * range(0,5).take(2) // [0,1]
 */
Iterator.prototype.take = function(count) {
	return this.while((x, i) => i < count);
};

/**
 * Skip first n items of iterator
 *
 * @param {number} count - items to skip
 * @returns {Iterator}
 * @example
 * range(0,5).skip(2) // [2,3,4]
 */
Iterator.prototype.skip = function(count) {
	return this.filter((x, i) => i >= count);
};

/**
 * Yield while while is true
 *
 * @param {filterFunction} fn - function to check items
 * @returns {Iterator}
 * @example
 * range(0,5).while(x => x < 3) // [0,1,2]
 */
Iterator.prototype.while = function(fn) {
	const it = function*() {
		let i = 0;
		for (let item of this.gen) {
			if (!fn(item, i)) break;
			yield item;
			i++;
		}
	};
	return new Iterator(it.call(this));
};

/**
 * Takes every nth items of iterator
 *
 * @param {number} modulus - items with index divided by this number will be yielded
 * @returns {Iterator}
 * @example
 * range(0,5).everyNth(2) // [0,2,4]
 */
Iterator.prototype.everyNth = function(n) {
	return this.filter((x, i) => i % n === 0);
};

/**
 * Take even items of iterator
 *
 * @returns {Iterator}
 * @example
 * range(0,5).even() // [0,2,4]
 */
Iterator.prototype.even = function() {
	return this.everyNth(2);
};

/**
 * Take odd items of iterator
 *
 * @param {number} count - items to take
 * @returns {Iterator}
 * @example
 * range(0,5).odd() // [1,3,5]
 */
Iterator.prototype.odd = function() {
	return this.skip(1).everyNth(2);
};

/**
 * Concat multiple iterators
 *
 * @param {...iterator} iters - iterators to take
 * @returns {Iterator}
 * @example
 * Iterator.fromArray([0,1,2])
 * .concat(Iterator.fromArray(["a","b","c"])) // [[0,1,2,"a","b","c"]]
 */
Iterator.prototype.concat = function(...iters) {
	const it = function*() {
		yield* this.gen;
		for (let iter of iters) yield* iter;
	};
	return new Iterator(it.call(this));
};

/**
 * Prepend multiple iterators
 *
 * @param {...iterator} iters - iterators to take
 * @returns {Iterator}
 * @example
 * Iterator.fromArray([0,1,2])
 * .concatLeft(Iterator.fromArray(["a","b","c"])) // [["a","b","c",0,1,2]]
 */
Iterator.prototype.concatLeft = function(...iters) {
	const it = function*() {
		for (let iter of iters) yield* iter;
		yield* this.gen;
	};
	return new Iterator(it.call(this));
};

/**
 * Merge multiple iterators
 *
 * @param {...iterator} iters - iterators to take
 * @returns {Iterator}
 * @example
 * Iterator.fromArray([0,1,2])
 * .merge(Iterator.fromArray(["a","b","c"])) // [[0,"a",1,"b",2,"c"]]
 */
Iterator.prototype.merge = function(...iters) {
	return Iterator.fromMultiple(this.gen, ...iters);
};

/**
 * Merge multiple iterators from left
 *
 * @param {...iterator} iters - iterators to take
 * @returns {Iterator}
 * @example
 * Iterator.fromArray([0,1,2])
 * .mergeLeft(Iterator.fromArray(["a","b","c"])) // [["a",0,"b",1,"c",2]]
 */
Iterator.prototype.mergeLeft = function(...iters) {
	return Iterator.fromMultiple(...iters, this.gen);
};

/**
 * function which Iterator instance mepthod consumes
 *
 * @typedef accumulatorComparator
 * @param {Any[]} arr - array of accumulated values
 * @param {*} current - iterator item which is also last item it arr
 * @param {number} index - item index
 * @return {boolean}
 */

/**
 * Accumulate multiple items until closure return true
 *
 * @param {accumulatorComparator} fn - comparison function
 * @param {boolean} [yieldRest=false] - specifies will iterator yield rest of values
 * @returns {Iterator}
 * @example
 * Iterator.fromArray(["a","b","c","a","b","c"])
 * .accumulateWhile((c,x)=> x === "c") // [["a","b","c"],["a","b","c"]]
 */
Iterator.prototype.accumulateWhile = function(fn, yieldRest = false) {
	const it = function*() {
		let step = this.gen.next();
		let arr = [];
		let i = 0;
		while (!step.done) {
			arr.push(step.value);
			if (fn(arr, step.value, i)) {
				yield arr;
				arr = [];
			}
			step = this.gen.next();
			i++;
		}
		if (arr.length > 0 && yieldRest) {
			yield arr;
		}
	};
	return new Iterator(it.call(this));
};

/**
 * Accumulate multiple items of iterator into one
 *
 * @param {number} n - items to take
 * @param {boolean} [yieldRest=false] - specifies will iterator yield the rest of values if iterator length wasn't divisible by modulus
 * @returns {Iterator}
 * @example
 * range(0,5).accumulateN(2, true) // [[0,1],[2,3],[4]]
 */
Iterator.prototype.accumulateN = function(n, yieldRest = false) {
	return this.accumulateWhile((c, x, i) => c.length === n, yieldRest);
};

/**
 * Generator function
 *
 * @typedef generator
 * @generator
 * @param {*} item - iterator item
 * @yields *
 */

/**
 * Subsplits iterator items and subyields them
 *
 * @param {generator} generator - generator
 * @returns {Iterator}
 * @example
 * Iterator.fromArray(["ab", "cd"]).subSplit(function*(item){
 * 	for(let char of item){
 * 		yield item
 * 	}
 * }) // ["a", "b", "c", "d"]
 */
Iterator.prototype.subSplit = function(gen) {
	const it = function*() {
		for (let item of this.gen) yield* gen(item);
	};
	return new Iterator(it.call(this));
};

/**
 * creates new Iterator from iterator
 *
 * @param {iterator} iter - iterator
 * @returns {Iterator}
 */
Iterator.new = function(iter) {
	return new Iterator(iter);
};

/**
 * Makes Iterator from array
 *
 * @param {Any[]} arr - array
 * @returns {Iterator}
 */
Iterator.fromArray = function(arr) {
	const it = function*() {
		for (let item of arr) yield item;
	};
	return new Iterator(it.call(this));
};

/**
 * Makes Iterator from array
 *
 * @param {...iterator} iters - iterators
 * @returns {Iterator}
 * @example
 * Iterator.fromMultiple(
 * 	Iterator.fromArray([1,2,3]),
 * 	Iterator.fromArray(["a","b","c"]),
 * ).toArray() // [1,"a","2","b",3,"c"]
 */
Iterator.fromMultiple = function(...iters) {
	const itersCopy = iters.slice(0);
	const it = function*() {
		while (itersCopy.length > 0) {
			for (let it of itersCopy) {
				let step = it.next();
				if (!step.done) {
					yield step.value;
				} else {
					itersCopy.splice(itersCopy.indexOf(it), 1);
				}
			}
		}
	};
	return new Iterator(it.call(this));
};

export default Iterator;
