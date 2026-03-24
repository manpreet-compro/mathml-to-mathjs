import { MathMLNode, NodeConverter } from '../types';
import { getElementChildren } from '../utils';

export function handleScripts(
  node: MathMLNode,
  convert: NodeConverter
): string {
  const children = getElementChildren(node);

  switch (node.localName) {
    case 'msup': {
      if (children.length < 2) return '';
      const base = convert(children[0]);
      const exp = convert(children[1]);
      return `(${base})^(${exp})`;
    }

    case 'msub': {
      // subscripts are not valid mathjs identifiers — flatten to base only
      // e.g. x_1 becomes x1 to remain a valid variable name
      if (children.length < 2) return '';
      const base = convert(children[0]);
      const sub = convert(children[1]);
      return `${base}${sub}`;
    }

    case 'msubsup': {
      // base, subscript, superscript
      if (children.length < 3) return '';
      const base = convert(children[0]);
      const exp = convert(children[2]);
      return `(${base})^(${exp})`;
    }

    case 'munder': {
      // e.g. lim_{x->0} — return just the base for mathjs purposes
      if (children.length < 1) return '';
      return convert(children[0]);
    }

    case 'mover': {
      if (children.length < 1) return '';
      return convert(children[0]);
    }

    case 'munderover': {
      // e.g. summation with lower/upper bounds — return base only
      if (children.length < 1) return '';
      return convert(children[0]);
    }

    default:
      return '';
  }
}
