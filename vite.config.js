import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import tsconfigPaths from 'vite-tsconfig-paths';
import { resolve } from 'path';
import fs from 'fs';

// Load path aliases from jsconfig.paths.json
const jsConfigPaths = JSON.parse(fs.readFileSync('./jsconfig.paths.json', 'utf-8'));
const pathsFromConfig = jsConfigPaths.compilerOptions.paths || {};

// Convert paths to Vite alias format
const aliasEntries = Object.entries(pathsFromConfig).reduce((acc, [key, paths]) => {
  const aliasKey = key.replace('/*', '');
  const aliasPath = paths[0].replace('./', './src/').replace('/*', '');
  acc[aliasKey] = resolve(__dirname, aliasPath);
  return acc;
}, {});

// Load environment variables
const envPrefix = ['VITE_', 'REACT_APP_', 'NODE_ENV', 'VERSION'];

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      // This is needed to support JSX in .js files
      include: "**/*.js",
    }),
    svgr(),
    tsconfigPaths(),
  ],
  resolve: {
    alias: [
      // Ensure node_modules/redux is resolved before any path aliases
      { find: /^redux$/, replacement: 'redux' },
      // Then add other aliases
      { find: 'src', replacement: resolve(__dirname, 'src') },
      ...Object.entries(aliasEntries).map(([key, value]) => ({
        find: key,
        replacement: value
      }))
    ],
    extensions: ['.js', '.jsx', '.json'],
  },
  define: {
    // Only expose specific environment variables to the client
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
    'process.env.VERSION': JSON.stringify(process.env.VERSION),
    // Add any other specific environment variables needed by the app
    // Format: 'process.env.VARIABLE_NAME': JSON.stringify(process.env.VARIABLE_NAME)
    ...Object.keys(process.env)
      .filter(key => key.startsWith('REACT_APP_'))
      .reduce((env, key) => {
        env[`process.env.${key}`] = JSON.stringify(process.env[key]);
        return env;
      }, {})
  },
  server: {
    port: 3000,
    open: true,
  },
  build: {
    outDir: 'build', // Same output directory as CRA
    sourcemap: true,
  },
  optimizeDeps: {
    include: ['buffer', 'redux', 'redux-persist', 'redux-saga'],
  },
  // Configure esbuild to handle JSX in .js files
  esbuild: {
    loader: 'jsx',
    include: /src\/.*\.jsx?$/,
    exclude: [],
  },
  // Environment variables
  envPrefix,
});
