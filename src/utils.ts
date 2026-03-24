import { MathMLNode } from './types';

export function getElementChildren(node: MathMLNode): MathMLNode[] {
  return Array.from(node.childNodes).filter(
    (n) => n.nodeType === 1 // ELEMENT_NODE
  ) as MathMLNode[];
}

export function getDOMParser(): {
  new (): { parseFromString(str: string, type: string): MathMLNode };
} {
  // Browser
  if (
    typeof window !== 'undefined' &&
    typeof window.DOMParser !== 'undefined'
  ) {
    return window.DOMParser as never;
  }

  // Node.js — requires @xmldom/xmldom peer dep
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { DOMParser } = require('@xmldom/xmldom');
    return DOMParser;
  } catch {
    throw new Error(
      'No DOMParser found. In Node.js, install the peer dependency: npm install @xmldom/xmldom'
    );
  }
}
