import path from 'path';
import fs from 'fs';
import ts from 'rollup-plugin-typescript2';
import commonjs from '@rollup/plugin-commonjs';
import replace from '@rollup/plugin-replace';

export function getPackagePath(packageName) {
	return path.resolve(__dirname, `../../packages/${packageName}`);
}

export const distDir = path.resolve(__dirname, `../../dist/node_modules`);

export function getPackageJSON(packageName) {
	const packageDir = getPackagePath(packageName);
	const packageJSONPath = packageDir + '/package.json';
	const jsonStr = fs.readFileSync(packageJSONPath, 'utf-8');
	return JSON.parse(jsonStr);
}

export function getBaseRollupPlugins() {
	return [
		commonjs(),
		ts({}),
		replace({
			__DEV__: JSON.stringify(true)
		})
	];
}
