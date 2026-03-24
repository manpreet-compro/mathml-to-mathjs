import { MathMLNode, NodeConverter } from '../types';
import { getElementChildren } from '../utils';

export function handleArithmetic(
  node: MathMLNode,
  convert: NodeConverter
): string {
  const children = getElementChildren(node);

  switch (node.localName) {
    case 'mfrac': {
      if (children.length < 2) return '';
      const num = convert(children[0]);
      const den = convert(children[1]);
      return `(${num}) / (${den})`;
    }

    case 'msqrt': {
      const inner = children.map(convert).join(' ');
      return `sqrt(${inner})`;
    }

    case 'mroot': {
      if (children.length < 2) return '';
      const base = convert(children[0]);
      const index = convert(children[1]);
      return `nthRoot(${base}, ${index})`;
    }

    default:
      return '';
  }
}
