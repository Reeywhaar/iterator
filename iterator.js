/**
 * Makes new Iterator.
 * @constructor
 * @param {generator} gen - generator function
 */
function Iterator(gen){
	this.gen = gen;
}

Iterator.prototype[Symbol.iterator] = function*(){
	yield* this.gen;
}

/**
 * Transform iterator to array.
 * Be aware with infinite iterators
 *
 * @returns {Any[]}
 */
Iterator.prototype.toArray = function(){
	let arr = [];
	for(let item of this.gen){
		arr.push(item);
	}
	return arr;
}

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
Iterator.prototype.map = function(fn){
	const it = function* () {
		let i = 0;
		for(let item of this.gen){
			yield fn(item, i);
			i++;
		}
	}
	return new Iterator(it.call(this));
}

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
Iterator.prototype.filter = function(fn){
	const it = function* () {
		let i = 0;
		for(let item of this.gen){
			if(fn(item, i)) yield item;
			i++;
		}
	}
	return new Iterator(it.call(this));
}


/**
 * function which Iterator instance mepthod consumes
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
Iterator.prototype.reduce = function(fn, initial){
	let obj = initial;
	let i = 0;
	if(typeof obj === "undefined"){
		const val = this.gen.next();
		i++;
		if(val.done){
			throw new Error("reduce of empty iterator with no initial value");
		}
		obj = val.value;
	};
	for(let item of this.gen){
		obj = fn(obj, item, i);
		i++;
	};
	return obj;
}

/**
 * Take first n items of iterator
 *
 * @param {number} count - items to take
 * @returns {Iterator}
 * @example
 * range(0,5).take(2) // [0,1]
 */
Iterator.prototype.take = function(count){
	return this.filter((x,i) => i < count);
}

/**
 * Skip first n items of iterator
 *
 * @param {number} count - items to skip
 * @returns {Iterator}
 * @example
 * range(0,5).skip(2) // [2,3,4]
 */
Iterator.prototype.skip = function(count){
	return this.filter((x,i) => i >= count);
}

/**
 * Yield while while is true
 *
 * @param {filterFunction} fn - function to check items
 * @returns {Iterator}
 * @example
 * range(0,5).while(x => x < 3) // [0,1,2]
 */
Iterator.prototype.while = function(fn){
	const it = function* () {
		let i = 0;
		for(let item of this.gen){
			if(!fn(item, i)) break;
			yield item;
			i++;
		}
	}
	return new Iterator(it.call(this));
}

/**
 * Takes every nth items of iterator
 *
 * @param {number} modulus - items with index divided by this number will be yielded
 * @returns {Iterator}
 * @example
 * range(0,5).everyNth(2) // [0,2,4]
 */
Iterator.prototype.everyNth = function(n){
	return this.filter((x, i) => i%n === 0);
}

/**
 * Take even items of iterator
 *
 * @returns {Iterator}
 * @example
 * range(0,5).evens() // [0,2,4]
 */
Iterator.prototype.evens = function(){
	return this.everyNth(2);
}

/**
 * Take odd items of iterator
 *
 * @param {number} count - items to take
 * @returns {Iterator}
 * @example
 * range(0,5).odds() // [1,3,5]
 */
Iterator.prototype.odds = function(){
	return this.skip(1).everyNth(2);
}

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
 * @param {boolean} [yieldRest=false] - specifies will iterator rest of values
 * @returns {Iterator}
 * @example
 * Iterator.fromArray(["a","b","c","a","b","c"])
 * .accumalateWhile((c,x)=> x === "c") // [["a","b","c"],["a","b","c"]]
 */
Iterator.prototype.accumulateWhile = function(fn, yieldRest = false){
	const it = function* () {
		let step = this.gen.next();
		let arr = [];
		let i = 0;
		while(!step.done){
			arr.push(step.value);
			if(fn(arr, step.value, i)){
				yield arr;
				arr = [];
			}
			step = this.gen.next();
			i++;
		};
		if(arr.length > 0 && yieldRest){
			yield arr;
		}
	}
	return new Iterator(it.call(this));
}

/**
 * Accumulate multiple items of iterator into one
 *
 * @param {number} n - items to take
 * @param {boolean} [yieldRest=false] - specifies will iterator will yield the rest of values if iterator length wasn't divisible by modulus
 * @returns {Iterator}
 * @example
 * range(0,5).accumulateN(2, true) // [[0,1],[2,3],[4]]
 */
Iterator.prototype.accumulateN = function(n, yieldRest = false){
	return this.accumulateWhile((c,x,i) => c.length === n, yieldRest);
}

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
Iterator.prototype.subSplit = function(gen){
	const it = function* () {
		for(let item of this.gen) yield* gen(item);
	}
	return new Iterator(it.call(this));
}

/**
 * Makes Iterator from array
 *
 * @param {Any[]} arr - array
 * @returns {Iterator}
 */
Iterator.fromArray = function(arr){
	const it = function* () {
		for(let item of arr) yield item;
	}
	return new Iterator(it.call(this));
}


module.exports = Iterator;