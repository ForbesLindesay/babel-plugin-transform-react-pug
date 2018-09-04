import path from 'path';
import {readdirSync, writeFileSync} from 'fs';

const ROOT_DIR = path.resolve(__dirname, '..');
const FILENAME = path.relative(ROOT_DIR, __filename);
const DISCLAIMER = `AUTOMATICALLY GENERATED BY ${FILENAME}`;
const SRC_VISITORS = path.resolve(ROOT_DIR, 'src', 'visitors');
const DEST_VISITORS = path.resolve(ROOT_DIR, 'src', 'visitors.generated.js');

const visitors = readdirSync(SRC_VISITORS)
  .map(visitor => visitor.replace(/\.js$/, ''))
  .sort();

const output = [`// ${DISCLAIMER}`, `// @flow`, ``];
output.push(`import type Context from './context';`);
output.push(`import t from './babel-types';`);
visitors.forEach(visitor => {
  output.push(`import ${visitor}Visitor from './visitors/${visitor}';`);
});
output.push(``);
output.push(`type Visitor = {`);
output.push(`  +jsx?: (node: Object, context: Context) => JSXValue,`);
output.push(`  +expression: (node: Object, context: Context) => Expression`);
output.push(`};`);
output.push(``);
output.push(`const visitors = {`);
visitors.forEach(visitor => {
  output.push(`  '${visitor}': (${visitor}Visitor: Visitor),`);
});
output.push(`};`);
output.push(`export default visitors;`);
output.push(``);

writeFileSync(DEST_VISITORS, output.join('\n'));
console.log(`${FILENAME} -> ${path.relative(ROOT_DIR, DEST_VISITORS)}`);
