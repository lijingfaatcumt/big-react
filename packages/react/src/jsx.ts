import { ElementType, Key, Props, Ref } from 'shared/ReactTypes';
import { REACT_ELEMENT_TYPE } from 'shared/ReactSymbols';

function ReactElement(type: ElementType, key: Key, ref: Ref, props: Props) {
	const element = {
		$$typeof: REACT_ELEMENT_TYPE,
		type,
		key,
		ref,
		props,
		__mark__: 'lijingfa'
	};
	return element;
}

export function jsxDEV(type: ElementType, config: any) {
	const props: any = {};
	let key = null;
	let ref = null;
	for (const prop in config) {
		const value = config[prop];
		if (prop === 'key' && value !== undefined) {
			key = value;
			continue;
		}
		if (prop === 'ref' && value !== undefined) {
			ref = value;
			continue;
		}
		// eslint-disable-next-line no-prototype-builtins
		if (config.hasOwnProperty(prop)) {
			props[prop] = value;
		}
	}
	return ReactElement(type, key, ref, props);
}

export function jsx(type: ElementType, config: any, ...children: any[]) {
	const childrenLength = children.length;
	if (childrenLength === 0) {
		config.children = null;
	} else if (childrenLength === 1) {
		config.children = children[0];
	} else {
		config.children = children;
	}
	return jsxDEV(type, config);
}
