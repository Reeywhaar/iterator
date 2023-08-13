// @ts-ignore
import assert from "assert";
import I from "./iterator";

function* range(max: number, start: number = 0): IterableIterator<number> {
  for (let i = start; i < start + max; i++) {
    yield i;
  }
}

function* counter(): IterableIterator<number> {
  let i = 0;
  while (true) {
    yield i;
    i++;
  }
}

function* chars(str: string): IterableIterator<string> {
  for (let char of str) {
    yield char;
  }
}

function* shakespeare(): IterableIterator<string> {
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
  for (let line of lear.split("\n")) {
    yield line;
  }
}

describe(`Iterator`, function () {
  describe(`instance methods`, function () {
    it(`constructs`, function () {
      const i = new I(range(5));
      let count = 0;
      for (let item of i) {
        assert.strictEqual(item, count);
        count++;
      }
      assert.strictEqual(count, 5);
    });
    it(`constructsFromArray`, function () {
      const i = new I([0, 1, 2]);
      let count = 0;
      for (let item of i) {
        assert.strictEqual(item, count);
        count++;
      }
      assert.strictEqual(count, 3);
    });
    it(`toArray`, function () {
      const i = new I(range(5));
      assert.deepStrictEqual(i.toArray(), [0, 1, 2, 3, 4]);
    });
    it(`pipe`, function () {
      const i = new I(range(5));
      assert.deepStrictEqual(
        i
          .pipe(function* (it) {
            for (let i of it) {
              yield i * 2;
            }
          })
          .toArray(),
        [0, 2, 4, 6, 8],
      );
    });
    it(`map`, function () {
      const i = new I(range(5));
      assert.deepStrictEqual(i.map((x) => x * 2).toArray(), [0, 2, 4, 6, 8]);
    });
    it(`forEach`, function () {
      const i = new I(range(5));
      const arr: number[] = [];
      i.forEach((x) => arr.push(x));
      assert.deepStrictEqual(arr, [0, 1, 2, 3, 4]);
    });
    it(`filter`, function () {
      const i = new I(range(5));
      assert.deepStrictEqual(i.filter((x) => x % 2 === 0).toArray(), [0, 2, 4]);
    });
    it(`reduce`, function () {
      const i = new I(range(5));
      assert.strictEqual(
        i.reduce<number>((c, x) => c + x),
        10,
      );
    });
    it(`enumerate`, function () {
      const i = new I(range(5, 2));
      assert.deepStrictEqual(i.enumerate().toArray(), [
        [0, 2],
        [1, 3],
        [2, 4],
        [3, 5],
        [4, 6],
      ]);
    });
    it(`take`, function () {
      const i = new I(range(5));
      assert.deepStrictEqual(i.take(2).toArray(), [0, 1]);
      const j = new I(counter());
      assert.deepStrictEqual(j.take(2).toArray(), [0, 1]);
    });
    it(`skip`, function () {
      const i = new I(range(5));
      assert.deepStrictEqual(i.skip(2).toArray(), [2, 3, 4]);
    });
    it(`while`, function () {
      const i = new I(range(5));
      assert.deepStrictEqual(i.while((x) => x < 3).toArray(), [0, 1, 2]);
    });
    it(`everyNth`, function () {
      const i = new I(range(5));
      assert.deepStrictEqual(i.everyNth(2).toArray(), [0, 2, 4]);
    });
    it(`odd`, function () {
      const i = new I(range(5));
      assert.deepStrictEqual(i.odd().toArray(), [1, 3]);
    });
    it(`even`, function () {
      const i = new I(range(5));
      assert.deepStrictEqual(i.even().toArray(), [0, 2, 4]);
    });
    it(`concat`, function () {
      const i = new I(range(3)).concat(I.fromArray(["a", "b", "c"]));
      assert.deepStrictEqual(i.toArray(), [0, 1, 2, "a", "b", "c"]);
    });
    it(`concatLeft`, function () {
      const i = new I(range(3)).concatLeft(I.fromArray(["a", "b", "c"]));
      assert.deepStrictEqual(i.toArray(), ["a", "b", "c", 0, 1, 2]);
    });
    it(`merge`, function () {
      const i = new I(range(3)).merge(I.fromArray(["a", "b", "c"]));
      assert.deepStrictEqual(i.toArray(), [0, "a", 1, "b", 2, "c"]);
    });
    it(`mergeLeft`, function () {
      const i = new I(range(3)).mergeLeft(I.fromArray(["a", "b", "c"]));
      assert.deepStrictEqual(i.toArray(), ["a", 0, "b", 1, "c", 2]);
    });
    it(`accumulateN`, function () {
      const i = new I(range(5));
      assert.deepStrictEqual(i.accumulateN(2).toArray(), [
        [0, 1],
        [2, 3],
      ]);
      const j = new I(range(5));
      assert.deepStrictEqual(j.accumulateN(2, true).toArray(), [
        [0, 1],
        [2, 3],
        [4],
      ]);
    });
    it(`accumulateWhile`, function () {
      const i = I.fromArray(["a", "b", "c", "a", "b", "c"]);
      assert.deepStrictEqual(
        i
          .accumulateWhile((c, x) => {
            return x === "c";
          })
          .toArray(),
        [
          ["a", "b", "c"],
          ["a", "b", "c"],
        ],
      );
    });
    it(`subSplit`, function () {
      const i = new I(shakespeare());
      assert.strictEqual(
        i.subSplit(chars).take(7).toArray().join(""),
        "To thee",
      );
    });
    it(`join`, function () {
      assert.strictEqual(I.fromArray(["a", "b", "c"]).join(), "abc");
      assert.strictEqual(I.fromArray([1, 2, 3]).join(","), "1,2,3");
    });
  });

  describe(`static methods`, function () {
    it(`new`, function () {
      const i = I.new(range(2));
      assert.deepStrictEqual(i.toArray(), [0, 1]);
    });
    it(`fromArray`, function () {
      const i = I.fromArray([1, 2, 3]);
      assert.deepStrictEqual(i.toArray(), [1, 2, 3]);
    });
    it(`fromMultiple`, function () {
      const i = I.fromMultiple(
        I.fromArray([1, 2, 3] as any[]),
        I.fromArray(["a", "b", "c"] as any[]),
      );
      assert.deepStrictEqual(i.toArray(), [1, "a", 2, "b", 3, "c"]);
    });
    it(`range`, function () {
      let i = I.range();
      assert.deepStrictEqual(
        i.toArray(),
        [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
        "initial failed",
      );
      i = I.range(5);
      assert.deepStrictEqual(i.toArray(), [0, 1, 2, 3, 4], "basic failed");
      i = I.range(2, 7);
      assert.deepStrictEqual(i.toArray(), [2, 3, 4, 5, 6, 7], "offset failed");
      i = I.range(7, 2);
      assert.deepStrictEqual(
        i.toArray(),
        [7, 6, 5, 4, 3, 2],
        "negative failed",
      );
      i = I.range(0, 6, 2);
      assert.deepStrictEqual(i.toArray(), [0, 2, 4, 6], "step failed");
      i = I.range(2, 11, 3);
      assert.deepStrictEqual(i.toArray(), [2, 5, 8, 11], "odd step failed");
      i = I.range(2, 12, 3);
      assert.deepStrictEqual(i.toArray(), [2, 5, 8, 11], "odd step failed");
      i = I.range(10, 0, 3);
      assert.deepStrictEqual(
        i.toArray(),
        [10, 7, 4, 1],
        "negative step failed",
      );
      i = I.range(10, -10, 3);
      assert.deepStrictEqual(
        i.toArray(),
        [10, 7, 4, 1, -2, -5, -8],
        "negative step failed",
      );
    });
    it(`counter`, function () {
      let i = I.counter().take(5);
      assert.deepStrictEqual(i.toArray(), [0, 1, 2, 3, 4], "basic failed");
      i = I.counter(3).take(5);
      assert.deepStrictEqual(i.toArray(), [0, 3, 6, 9, 12], "basic failed");
      i = I.counter(-2).take(5);
      assert.deepStrictEqual(i.toArray(), [0, -2, -4, -6, -8], "basic failed");
    });
  });

  describe(`Extends`, function () {
    it(`extends`, function () {
      class VI extends I<number> {
        dummy() {
          let it = this;
          let fn = function* () {
            for (let item of it) {
              yield item * 2;
            }
          };
          return new (this.constructor as new (a: any) => VI)(fn());
        }
      }

      {
        let i = new VI([1, 2, 3]);
        assert(typeof i.dummy === "function");
      }
      {
        let i = VI.fromArray([1, 2, 3]);
        assert(typeof (i as VI).dummy === "function");
        assert.deepEqual((i as VI).dummy().toArray(), [2, 4, 6]);
      }
    });
  });
});
