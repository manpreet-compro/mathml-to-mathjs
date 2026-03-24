# mathml-to-mathjs

Convert MathML strings into [mathjs](https://mathjs.org/)-compatible expression strings. Works in both **browser** and **Node.js**.

## Install

```bash
npm install mathml-to-mathjs
```

If you're running in **Node.js**, also install the peer dependency:

```bash
npm install @xmldom/xmldom
```

> In the browser, the native `DOMParser` is used automatically — no extra install needed.

## Usage

```js
import { parse } from 'mathml-to-mathjs';

const mathml = `
  <math xmlns="http://www.w3.org/1998/Math/MathML">
    <mrow>
      <mi>b</mi><mo>+</mo><mi>a</mi>
    </mrow>
  </math>
`;

parse(mathml); // → "b + a"
```

### With mathjs — validate equivalence

```js
import { parse } from 'mathml-to-mathjs';
import { simplify, evaluate } from 'mathjs';

function areEquivalent(mathml1, mathml2) {
  const expr1 = parse(mathml1);
  const expr2 = parse(mathml2);

  // Symbolic check
  const diff = simplify(`(${expr1}) - (${expr2})`);
  if (diff.toString() === '0') return true;

  // Numeric check across test points
  const points = [
    { x: 1, a: 2, b: 3 },
    { x: -2, a: 0.5, b: -1 },
    { x: 3.7, a: 10, b: 0.1 },
  ];

  return points.every(pt => Math.abs(evaluate(expr1, pt) - evaluate(expr2, pt)) < 1e-9);
}
```

## Supported MathML tags

| Tag | Output |
|-----|--------|
| `mn` | number literal |
| `mi` | variable / function name |
| `mo` | operator (unicode operators normalised to ASCII) |
| `mrow`, `math`, `mstyle`, `mpadded` | transparent grouping |
| `mfrac` | `(num) / (den)` |
| `msqrt` | `sqrt(...)` |
| `mroot` | `nthRoot(base, index)` |
| `msup` | `(base)^(exp)` |
| `msub` | base + subscript concatenated (e.g. `x1`) |
| `msubsup` | `(base)^(exp)` |
| `mfenced` | `(...)` |
| `munder`, `mover`, `munderover` | base only |
| `mtable` / `mtr` / `mtd` | `[[a, b], [c, d]]` |
| `semantics` | first child only |
| `mtext`, `mphantom`, `annotation` | skipped |

## Options

```ts
parse(mathml, options?)
```

### `options.tagHandlers`

Override or extend any tag's behaviour:

```js
parse(mathml, {
  tagHandlers: {
    // include mtext content instead of skipping it
    mtext: (node, convert) => node.textContent ?? '',
  },
});
```

## License

MIT
