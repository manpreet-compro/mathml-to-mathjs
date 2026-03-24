import { MathMLNode, NodeConverter, ConvertOptions } from './types';
import { getElementChildren, getDOMParser } from './utils';
import { handleToken } from './tags/tokens';
import { handleArithmetic } from './tags/arithmetic';
import { handleScripts } from './tags/scripts';
import { handleLayout } from './tags/layout';

const TOKEN_TAGS = new Set(['mn', 'mi', 'mo']);
const ARITHMETIC_TAGS = new Set(['mfrac', 'msqrt', 'mroot']);
const SCRIPT_TAGS = new Set([
  'msup',
  'msub',
  'msubsup',
  'munder',
  'mover',
  'munderover'
]);

export function buildConverter(options: ConvertOptions = {}): NodeConverter {
  const customHandlers = options.tagHandlers ?? {};

  function convert(node: MathMLNode): string {
    const tag = node.localName;

    // 1. Custom handler takes priority
    if (customHandlers[tag]) {
      return customHandlers[tag](node, convert);
    }

    // 2. Text node
    if (node.nodeType === 3) {
      return node.textContent?.trim() ?? '';
    }

    // 3. Route by tag group
    if (TOKEN_TAGS.has(tag)) return handleToken(node);
    if (ARITHMETIC_TAGS.has(tag)) return handleArithmetic(node, convert);
    if (SCRIPT_TAGS.has(tag)) return handleScripts(node, convert);

    // 4. Layout / structural tags (catches everything else including unknown tags)
    return handleLayout(node, convert);
  }

  return convert;
}

export function parse(mathml: string, options: ConvertOptions = {}): string {
  if (!mathml || mathml.trim() === '') {
    throw new Error('Input MathML string is empty.');
  }

  const DOMParser = getDOMParser();
  const doc = new DOMParser().parseFromString(
    mathml,
    'application/xml'
  ) as unknown as MathMLNode;

  // xmldom wraps in a document node; get the root element
  const root = getElementChildren(doc)[0];
  if (!root) {
    throw new Error('Could not parse MathML: no root element found.');
  }

  const convert = buildConverter(options);
  const result = convert(root);

  // Normalize whitespace
  return result.replace(/\s+/g, ' ').trim();
}
