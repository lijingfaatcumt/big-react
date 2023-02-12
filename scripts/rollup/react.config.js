import {
	distDir,
	getPackageJSON,
	getPackagePath,
	getBaseRollupPlugins
} from './utils';

import generatePackageJSON from 'rollup-plugin-generate-package-json';

const packageName = 'react';
const packagePath = getPackagePath('react');
const { module } = getPackageJSON(packageName);
const distPath = `${distDir}/${packageName}`;

export default [
	{
		input: `${packagePath}/${module}`,
		output: {
			file: `${distPath}/index.js`,
			name: 'index.js',
			format: 'umd'
		},
		plugins: [
			...getBaseRollupPlugins(),
			generatePackageJSON({
				inputFolder: packagePath,
				outputFolder: distPath,
				baseContents: ({ name, version, description }) => {
					return {
						name,
						version,
						description,
						main: 'index.js'
					};
				}
			})
		]
	},
	{
		input: `${packagePath}/src/jsx.ts`,
		output: [
			{
				file: `${distPath}/jsx-dev-runtime.js`,
				name: `jsx-dev-runtime.js`,
				format: 'umd'
			},
			{
				file: `${distPath}/jsx-runtime.js`,
				name: `jsx-runtime.js`,
				format: 'umd'
			}
		],
		plugins: getBaseRollupPlugins()
	}
];
