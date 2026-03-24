import typescript from '@rollup/plugin-typescript';

const tsPlugin = typescript({
  tsconfig: './tsconfig.build.json'
});

export default [
  {
    input: 'src/index.ts',
    output: [
      {
        file: 'dist/index.esm.js',
        format: 'esm',
        sourcemap: true
      },
      {
        file: 'dist/index.cjs.js',
        format: 'cjs',
        sourcemap: true,
        exports: 'named'
      }
    ],
    plugins: [tsPlugin],
    external: ['@xmldom/xmldom']
  }
];
