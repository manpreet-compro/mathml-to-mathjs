import { parse } from '../src';

// ─── helpers ────────────────────────────────────────────────────────────────

function wrap(inner: string): string {
  return `<math xmlns="http://www.w3.org/1998/Math/MathML">${inner}</math>`;
}

// ─── tokens ─────────────────────────────────────────────────────────────────

describe('tokens', () => {
  test('number', () => {
    expect(parse(wrap('<mn>42</mn>'))).toBe('42');
  });

  test('identifier', () => {
    expect(parse(wrap('<mi>x</mi>'))).toBe('x');
  });

  test('operator +', () => {
    expect(parse(wrap('<mo>+</mo>'))).toBe('+');
  });

  test('unicode minus normalised to -', () => {
    expect(parse(wrap('<mo>−</mo>'))).toBe('-');
  });

  test('unicode times normalised to *', () => {
    expect(parse(wrap('<mo>×</mo>'))).toBe('*');
  });
});

// ─── basic arithmetic ────────────────────────────────────────────────────────

describe('basic arithmetic', () => {
  test('a + b', () => {
    expect(parse(wrap('<mrow><mi>a</mi><mo>+</mo><mi>b</mi></mrow>'))).toBe(
      'a + b'
    );
  });

  test('b + a (commutativity check)', () => {
    expect(parse(wrap('<mrow><mi>b</mi><mo>+</mo><mi>a</mi></mrow>'))).toBe(
      'b + a'
    );
  });

  test('3 * x', () => {
    expect(parse(wrap('<mrow><mn>3</mn><mo>*</mo><mi>x</mi></mrow>'))).toBe(
      '3 * x'
    );
  });
});

// ─── fractions ───────────────────────────────────────────────────────────────

describe('mfrac', () => {
  test('a / b', () => {
    expect(parse(wrap('<mfrac><mi>a</mi><mi>b</mi></mfrac>'))).toBe(
      '(a) / (b)'
    );
  });

  test('nested fraction', () => {
    const mathml = wrap(
      '<mfrac><mfrac><mn>1</mn><mn>2</mn></mfrac><mn>3</mn></mfrac>'
    );
    expect(parse(mathml)).toBe('((1) / (2)) / (3)');
  });
});

// ─── powers ──────────────────────────────────────────────────────────────────

describe('msup', () => {
  test('x^2', () => {
    expect(parse(wrap('<msup><mi>x</mi><mn>2</mn></msup>'))).toBe('(x)^(2)');
  });

  test('(x+1)^2', () => {
    const mathml = wrap(
      '<msup><mrow><mi>x</mi><mo>+</mo><mn>1</mn></mrow><mn>2</mn></msup>'
    );
    expect(parse(mathml)).toBe('(x + 1)^(2)');
  });
});

// ─── roots ───────────────────────────────────────────────────────────────────

describe('msqrt / mroot', () => {
  test('sqrt(x)', () => {
    expect(parse(wrap('<msqrt><mi>x</mi></msqrt>'))).toBe('sqrt(x)');
  });

  test('cube root of x', () => {
    expect(parse(wrap('<mroot><mi>x</mi><mn>3</mn></mroot>'))).toBe(
      'nthRoot(x, 3)'
    );
  });
});

// ─── subscripts ──────────────────────────────────────────────────────────────

describe('msub', () => {
  test('x_1 flattened to x1', () => {
    expect(parse(wrap('<msub><mi>x</mi><mn>1</mn></msub>'))).toBe('x1');
  });
});

// ─── fenced ──────────────────────────────────────────────────────────────────

describe('mfenced', () => {
  test('(a + b)', () => {
    const mathml = wrap(
      '<mfenced><mrow><mi>a</mi><mo>+</mo><mi>b</mi></mrow></mfenced>'
    );
    expect(parse(mathml)).toBe('(a + b)');
  });
});

// ─── layout tags ─────────────────────────────────────────────────────────────

describe('layout', () => {
  test('mstyle passes through', () => {
    expect(parse(wrap('<mstyle><mi>x</mi><mo>+</mo><mn>1</mn></mstyle>'))).toBe(
      'x + 1'
    );
  });

  test('mphantom is skipped', () => {
    expect(
      parse(wrap('<mrow><mi>x</mi><mphantom><mn>0</mn></mphantom></mrow>'))
    ).toBe('x');
  });

  test('mtext is skipped', () => {
    expect(
      parse(
        wrap('<mrow><mi>x</mi><mtext>label</mtext><mo>+</mo><mn>1</mn></mrow>')
      )
    ).toBe('x + 1');
  });
});

// ─── semantics ───────────────────────────────────────────────────────────────

describe('semantics', () => {
  test('uses first child, ignores annotation', () => {
    const mathml = wrap(`
      <semantics>
        <mrow><mi>x</mi><mo>+</mo><mn>1</mn></mrow>
        <annotation encoding="application/x-tex">x+1</annotation>
      </semantics>
    `);
    expect(parse(mathml)).toBe('x + 1');
  });
});

// ─── custom tag handler ──────────────────────────────────────────────────────

describe('custom tag handlers (ConvertOptions)', () => {
  test('override mtext to include its content', () => {
    const mathml = wrap('<mrow><mi>x</mi><mtext>meters</mtext></mrow>');
    const result = parse(mathml, {
      tagHandlers: {
        mtext: (node) => node.textContent ?? ''
      }
    });
    expect(result).toBe('x meters');
  });
});

// ─── error handling ──────────────────────────────────────────────────────────

describe('errors', () => {
  test('throws on empty input', () => {
    expect(() => parse('')).toThrow('Input MathML string is empty.');
  });
});
