import { MathMLNode } from '../types';

export function handleToken(node: MathMLNode): string {
  const text = node.textContent?.trim() ?? '';

  switch (node.localName) {
    case 'mn':
      return text;

    case 'mi':
      // single-letter identifiers are variables; multi-letter are functions
      return text;

    case 'mo':
      return normalizeOperator(text);

    default:
      return text;
  }
}

function normalizeOperator(op: string): string {
  switch (op) {
    case '×':
      return '*';
    case '·':
      return '*';
    case '÷':
      return '/';
    case '−':
      return '-'; // unicode minus → ASCII
    case '–':
      return '-'; // en dash
    case '±':
      return '+'; // best-effort
    case '∗':
      return '*';
    case '=':
      return '=';
    default:
      return op;
  }
}
