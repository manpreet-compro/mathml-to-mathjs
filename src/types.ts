export interface MathMLNode {
  localName: string;
  nodeType: number;
  textContent: string | null;
  childNodes: ArrayLike<MathMLNode>;
  getAttribute?: (name: string) => string | null;
}

export type NodeConverter = (node: MathMLNode) => string;

export interface ConvertOptions {
  /**
   * Custom tag handlers. Key is the MathML tag name, value is a function
   * that receives the node and the default converter, returns a string.
   * Use this to override or extend built-in tag handling.
   *
   * @example
   * {
   *   tagHandlers: {
   *     'mtext': (node, convert) => node.textContent ?? ''
   *   }
   * }
   */
  tagHandlers?: Record<
    string,
    (node: MathMLNode, convert: NodeConverter) => string
  >;
}
