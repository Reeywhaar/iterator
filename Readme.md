# Iterator library

Library to work with javascript generators

<pre>
npm install @reeywhaar/iterator
</pre>

<pre>
Iterator
.fromArray([0,1,2,3,4,5,6,7,8])
.take(5) // [0,1,2,3,4]
.map(x => x * 2) // [0,2,4,6,8]
.skip(2) // [4,6,8]
.subSplit(function*(item){
	yield item;
	yield "a";
}) // [4,"a",6,"a",8,"a"]
.odds() // ["a","a","a"]
// ...and so on. Check out <a href="https://github.com/Reeywhaar/iterator/blob/master/Documentation.md">Documentation</a>
</pre>