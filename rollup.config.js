import typescript from 'rollup-plugin-typescript2';

export default [
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/index.esm.js',
      format: 'esm',
      sourcemap: true
    },
    plugins: [typescript({ tsconfig: './tsconfig.json' })],
    external: ['@xmldom/xmldom']
  },
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/index.cjs.js',
      format: 'cjs',
      sourcemap: true,
      exports: 'named'
    },
    plugins: [typescript({ tsconfig: './tsconfig.json' })],
    external: ['@xmldom/xmldom']
  }
];
