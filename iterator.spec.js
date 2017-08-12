const assert = require("assert");
const I = require("./iterator.js");

function* range(max, start = 0){
	for(let i = 0; i < start + max; i++){
		yield i;
	}
}

function* chars(str){
	for(let char of str){
		yield char;
	}
}

function* shakespeare(){
	const lear = `
To thee and thine hereditary ever
Remain this ample third of our fair kingdom;
No less in space, validity, and pleasure,
Than that conferr'd on Goneril. Now, our joy,
Although the last, not least; to whose young love
The vines of France and milk of Burgundy
Strive to be interess'd; what can you say to draw
A third more opulent than your sisters? Speak.
	`;
	for(let line of lear.split("\n")){
		yield line;
	}
}

describe(`Iterator`, function(){
	describe(`instance methods`, function(){
		it(`constructs`, function(){
			const i = new I(range(5));
			let count = 0;
			for(let item of i){
				assert.strictEqual(item, count);
				count++;
			};
			assert.strictEqual(count, 5);
		});
		it(`toArray`, function(){
			const i = new I(range(5));
			assert.deepStrictEqual(i.toArray(), [0,1,2,3,4]);
		});
		it(`map`, function(){
			const i = new I(range(5));
			assert.deepStrictEqual(i.map(x => x*2).toArray(), [0,2,4,6,8]);
		});
		it(`filter`, function(){
			const i = new I(range(5));
			assert.deepStrictEqual(i.filter(x => x%2 === 0).toArray(), [0,2,4]);
		});
		it(`reduce`, function(){
			const i = new I(range(5));
			assert.strictEqual(i.reduce((c, x) => c + x), 10);
		});
		it(`take`, function(){
			const i = new I(range(5));
			assert.deepStrictEqual(i.take(2).toArray(), [0,1]);
		});
		it(`skip`, function(){
			const i = new I(range(5));
			assert.deepStrictEqual(i.skip(2).toArray(), [2,3,4]);
		});
		it(`while`, function(){
			const i = new I(range(5));
			assert.deepStrictEqual(i.while(x => x < 3).toArray(), [0,1,2]);
		});
		it(`everyNth`, function(){
			const i = new I(range(5));
			assert.deepStrictEqual(i.everyNth(2).toArray(), [0,2,4]);
		});
		it(`odds`, function(){
			const i = new I(range(5));
			assert.deepStrictEqual(i.odds().toArray(), [1,3]);
		});
		it(`evens`, function(){
			const i = new I(range(5));
			assert.deepStrictEqual(i.evens().toArray(), [0,2,4]);
		});
		it(`takeMultiple`, function(){
			const i = new I(range(5));
			assert.deepStrictEqual(i.accumulateN(2).toArray(), [[0,1],[2,3]]);
			const j = new I(range(5));
			assert.deepStrictEqual(j.accumulateN(2, true).toArray(), [[0,1],[2,3],[4]]);
		});
		it(`subSplit`, function(){
			const i = new I(shakespeare());
			assert.strictEqual(
				i.subSplit(chars).take(7).toArray().join(""),
				"To thee"
			);
		});
	});

	describe(`static methods`, function(){
		it(`fromArray`, function(){
			const i = I.fromArray([1,2,3]);
			assert.deepStrictEqual(i.toArray(), [1,2,3]);
		});
	});
});