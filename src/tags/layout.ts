import { MathMLNode, NodeConverter } from '../types';
import { getElementChildren } from '../utils';

export function handleLayout(node: MathMLNode, convert: NodeConverter): string {
  const children = getElementChildren(node);

  switch (node.localName) {
    case 'math':
    case 'mrow':
    case 'mstyle':
    case 'mpadded':
    case 'merror':
    case 'maction':
      return children.map(convert).join(' ');

    case 'mphantom':
      // invisible content — skip entirely
      return '';

    case 'mtext':
      // annotation text, not part of the expression
      return '';

    case 'mspace':
      return ' ';

    case 'mfenced': {
      // wraps children in parentheses; open/close attrs can vary
      const inner = children.map(convert).join(', ');
      return `(${inner})`;
    }

    case 'menclose':
      // decorative enclosure — treat as grouping
      return children.map(convert).join(' ');

    case 'semantics': {
      // prefer first child (the actual math), ignore annotations
      if (children.length > 0) return convert(children[0]);
      return '';
    }

    case 'annotation':
    case 'annotation-xml':
      return '';

    case 'mtable': {
      // matrix: [[a,b],[c,d]]
      const rows = children.map((row) => {
        const cells = getElementChildren(row).map((cell) => {
          const cellChildren = getElementChildren(cell);
          return cellChildren.map(convert).join(' ');
        });
        return `[${cells.join(', ')}]`;
      });
      return `[${rows.join(', ')}]`;
    }

    default:
      return children.map(convert).join(' ');
  }
}
