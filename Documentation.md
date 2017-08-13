## Classes

<dl>
<dt><a href="#Iterator">Iterator</a></dt>
<dd></dd>
</dl>

## Typedefs

<dl>
<dt><a href="#mapFunction">mapFunction</a> ⇒</dt>
<dd><p>function which Iterator instance mepthod consumes</p>
</dd>
<dt><a href="#filterFunction">filterFunction</a> ⇒ <code>boolean</code></dt>
<dd><p>function which Iterator instance mepthod consumes</p>
</dd>
<dt><a href="#reduceFunction">reduceFunction</a> ⇒ <code>*</code></dt>
<dd><p>function which Iterator instance method consumes</p>
</dd>
<dt><a href="#accumulatorComparator">accumulatorComparator</a> ⇒ <code>boolean</code></dt>
<dd><p>function which Iterator instance mepthod consumes</p>
</dd>
<dt><a href="#generator">generator</a></dt>
<dd><p>Generator function</p>
</dd>
</dl>

<a name="Iterator"></a>

## Iterator
**Kind**: global class  

* [Iterator](#Iterator)
    * [new Iterator(gen)](#new_Iterator_new)
    * _instance_
        * [.toArray()](#Iterator+toArray) ⇒ <code>Array.&lt;Any&gt;</code>
        * [.map(fn)](#Iterator+map) ⇒ [<code>Iterator</code>](#Iterator)
        * [.forEach(fn)](#Iterator+forEach) ⇒ <code>void</code>
        * [.filter(fn)](#Iterator+filter) ⇒ [<code>Iterator</code>](#Iterator)
        * [.reduce(fn, [initialValue])](#Iterator+reduce) ⇒ <code>\*</code>
        * [.take(count)](#Iterator+take) ⇒ [<code>Iterator</code>](#Iterator)
        * [.skip(count)](#Iterator+skip) ⇒ [<code>Iterator</code>](#Iterator)
        * [.while(fn)](#Iterator+while) ⇒ [<code>Iterator</code>](#Iterator)
        * [.everyNth(modulus)](#Iterator+everyNth) ⇒ [<code>Iterator</code>](#Iterator)
        * [.evens()](#Iterator+evens) ⇒ [<code>Iterator</code>](#Iterator)
        * [.odds(count)](#Iterator+odds) ⇒ [<code>Iterator</code>](#Iterator)
        * [.accumulateWhile(fn, [yieldRest])](#Iterator+accumulateWhile) ⇒ [<code>Iterator</code>](#Iterator)
        * [.accumulateN(n, [yieldRest])](#Iterator+accumulateN) ⇒ [<code>Iterator</code>](#Iterator)
        * [.subSplit(generator)](#Iterator+subSplit) ⇒ [<code>Iterator</code>](#Iterator)
    * _static_
        * [.fromArray(arr)](#Iterator.fromArray) ⇒ [<code>Iterator</code>](#Iterator)
        * [.fromMultiple(iters)](#Iterator.fromMultiple) ⇒ [<code>Iterator</code>](#Iterator)

<a name="new_Iterator_new"></a>

### new Iterator(gen)
Makes new Iterator.


| Param | Type | Description |
| --- | --- | --- |
| gen | <code>iterator</code> | iterator |

<a name="Iterator+toArray"></a>

### iterator.toArray() ⇒ <code>Array.&lt;Any&gt;</code>
Transform iterator to array.
Be aware with infinite iterators

**Kind**: instance method of [<code>Iterator</code>](#Iterator)  
<a name="Iterator+map"></a>

### iterator.map(fn) ⇒ [<code>Iterator</code>](#Iterator)
Map over iterator values

**Kind**: instance method of [<code>Iterator</code>](#Iterator)  

| Param | Type | Description |
| --- | --- | --- |
| fn | [<code>mapFunction</code>](#mapFunction) | function to transform values |

**Example**  
```js
range(0,5).map(x => x*2) // [0,2,4,6,8]
```
<a name="Iterator+forEach"></a>

### iterator.forEach(fn) ⇒ <code>void</code>
Executes function over iterator item.
Be aware that iterator will be consumed after this.

**Kind**: instance method of [<code>Iterator</code>](#Iterator)  

| Param | Type | Description |
| --- | --- | --- |
| fn | [<code>mapFunction</code>](#mapFunction) | function to transform values |

**Example**  
```js
const arr = [];
range(0,5).forEach(x => arr.push(x*2))
arr; // [0,2,4,6,8]
```
<a name="Iterator+filter"></a>

### iterator.filter(fn) ⇒ [<code>Iterator</code>](#Iterator)
Filter iterator values

**Kind**: instance method of [<code>Iterator</code>](#Iterator)  

| Param | Type | Description |
| --- | --- | --- |
| fn | [<code>filterFunction</code>](#filterFunction) | function to transform values |

**Example**  
```js
range(0,5).filter(x => x%2 === 0) // [0,2,4]
```
<a name="Iterator+reduce"></a>

### iterator.reduce(fn, [initialValue]) ⇒ <code>\*</code>
Reduce iterator

**Kind**: instance method of [<code>Iterator</code>](#Iterator)  

| Param | Type | Description |
| --- | --- | --- |
| fn | [<code>reduceFunction</code>](#reduceFunction) | function to reduce iterator |
| [initialValue] | <code>\*</code> | initial value of accumulator. if not provided then first item of iterator will be used |

**Example**  
```js
range(0,5).reduce((c,x) => c+x) // 10
```
<a name="Iterator+take"></a>

### iterator.take(count) ⇒ [<code>Iterator</code>](#Iterator)
Take first n items of iterator

**Kind**: instance method of [<code>Iterator</code>](#Iterator)  

| Param | Type | Description |
| --- | --- | --- |
| count | <code>number</code> | items to take |

**Example**  
```js
range(0,5).take(2) // [0,1]
```
<a name="Iterator+skip"></a>

### iterator.skip(count) ⇒ [<code>Iterator</code>](#Iterator)
Skip first n items of iterator

**Kind**: instance method of [<code>Iterator</code>](#Iterator)  

| Param | Type | Description |
| --- | --- | --- |
| count | <code>number</code> | items to skip |

**Example**  
```js
range(0,5).skip(2) // [2,3,4]
```
<a name="Iterator+while"></a>

### iterator.while(fn) ⇒ [<code>Iterator</code>](#Iterator)
Yield while while is true

**Kind**: instance method of [<code>Iterator</code>](#Iterator)  

| Param | Type | Description |
| --- | --- | --- |
| fn | [<code>filterFunction</code>](#filterFunction) | function to check items |

**Example**  
```js
range(0,5).while(x => x < 3) // [0,1,2]
```
<a name="Iterator+everyNth"></a>

### iterator.everyNth(modulus) ⇒ [<code>Iterator</code>](#Iterator)
Takes every nth items of iterator

**Kind**: instance method of [<code>Iterator</code>](#Iterator)  

| Param | Type | Description |
| --- | --- | --- |
| modulus | <code>number</code> | items with index divided by this number will be yielded |

**Example**  
```js
range(0,5).everyNth(2) // [0,2,4]
```
<a name="Iterator+evens"></a>

### iterator.evens() ⇒ [<code>Iterator</code>](#Iterator)
Take even items of iterator

**Kind**: instance method of [<code>Iterator</code>](#Iterator)  
**Example**  
```js
range(0,5).evens() // [0,2,4]
```
<a name="Iterator+odds"></a>

### iterator.odds(count) ⇒ [<code>Iterator</code>](#Iterator)
Take odd items of iterator

**Kind**: instance method of [<code>Iterator</code>](#Iterator)  

| Param | Type | Description |
| --- | --- | --- |
| count | <code>number</code> | items to take |

**Example**  
```js
range(0,5).odds() // [1,3,5]
```
<a name="Iterator+accumulateWhile"></a>

### iterator.accumulateWhile(fn, [yieldRest]) ⇒ [<code>Iterator</code>](#Iterator)
Accumulate multiple items until closure return true

**Kind**: instance method of [<code>Iterator</code>](#Iterator)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| fn | [<code>accumulatorComparator</code>](#accumulatorComparator) |  | comparison function |
| [yieldRest] | <code>boolean</code> | <code>false</code> | specifies will iterator yield rest of values |

**Example**  
```js
Iterator.fromArray(["a","b","c","a","b","c"])
.accumalateWhile((c,x)=> x === "c") // [["a","b","c"],["a","b","c"]]
```
<a name="Iterator+accumulateN"></a>

### iterator.accumulateN(n, [yieldRest]) ⇒ [<code>Iterator</code>](#Iterator)
Accumulate multiple items of iterator into one

**Kind**: instance method of [<code>Iterator</code>](#Iterator)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| n | <code>number</code> |  | items to take |
| [yieldRest] | <code>boolean</code> | <code>false</code> | specifies will iterator yield the rest of values if iterator length wasn't divisible by modulus |

**Example**  
```js
range(0,5).accumulateN(2, true) // [[0,1],[2,3],[4]]
```
<a name="Iterator+subSplit"></a>

### iterator.subSplit(generator) ⇒ [<code>Iterator</code>](#Iterator)
Subsplits iterator items and subyields them

**Kind**: instance method of [<code>Iterator</code>](#Iterator)  

| Param | Type | Description |
| --- | --- | --- |
| generator | [<code>generator</code>](#generator) | generator |

**Example**  
```js
Iterator.fromArray(["ab", "cd"]).subSplit(function*(item){
	for(let char of item){
		yield item
	}
}) // ["a", "b", "c", "d"]
```
<a name="Iterator.fromArray"></a>

### Iterator.fromArray(arr) ⇒ [<code>Iterator</code>](#Iterator)
Makes Iterator from array

**Kind**: static method of [<code>Iterator</code>](#Iterator)  

| Param | Type | Description |
| --- | --- | --- |
| arr | <code>Array.&lt;Any&gt;</code> | array |

<a name="Iterator.fromMultiple"></a>

### Iterator.fromMultiple(iters) ⇒ [<code>Iterator</code>](#Iterator)
Makes Iterator from array

**Kind**: static method of [<code>Iterator</code>](#Iterator)  

| Param | Type | Description |
| --- | --- | --- |
| iters | <code>Array.&lt;iterator&gt;</code> | iterators |

**Example**  
```js
Iterator.fromMultiple(
	Iterator.fromArray([1,2,3]),
	Iterator.fromArray(["a","b","c"]),
).toArray() // [1,"a","2","b",3,"c"]
```
<a name="mapFunction"></a>

## mapFunction ⇒
function which Iterator instance mepthod consumes

**Kind**: global typedef  
**Returns**: *  

| Param | Type | Description |
| --- | --- | --- |
| item | <code>\*</code> | iterator item |
| index | <code>number</code> | item index |

<a name="filterFunction"></a>

## filterFunction ⇒ <code>boolean</code>
function which Iterator instance mepthod consumes

**Kind**: global typedef  

| Param | Type | Description |
| --- | --- | --- |
| item | <code>\*</code> | iterator item |
| index | <code>number</code> | item index |

<a name="reduceFunction"></a>

## reduceFunction ⇒ <code>\*</code>
function which Iterator instance method consumes

**Kind**: global typedef  

| Param | Type | Description |
| --- | --- | --- |
| carry | <code>\*</code> | accumulator |
| item | <code>\*</code> | iterator item |
| index | <code>number</code> | item index |

<a name="accumulatorComparator"></a>

## accumulatorComparator ⇒ <code>boolean</code>
function which Iterator instance mepthod consumes

**Kind**: global typedef  

| Param | Type | Description |
| --- | --- | --- |
| arr | <code>Array.&lt;Any&gt;</code> | array of accumulated values |
| current | <code>\*</code> | iterator item which is also last item it arr |
| index | <code>number</code> | item index |

<a name="generator"></a>

## generator
Generator function

**Kind**: global typedef  
**Generator**:   
**Yields**: *  

| Param | Type | Description |
| --- | --- | --- |
| item | <code>\*</code> | iterator item |

