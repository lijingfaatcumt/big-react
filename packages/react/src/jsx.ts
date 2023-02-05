import { ElementType, Key, Props, Ref } from 'shared/ReactTypes';
import { REACT_ELEMENT_TYPE } from 'shared/ReactSymbols';

export function ReactElement(
	type: ElementType,
	key: Key,
	ref: Ref,
	props: Props
) {
	const element = {
		$$typeof: REACT_ELEMENT_TYPE,
		type,
		key,
		ref,
		props
	};
	return element;
}

export function jsx(type: ElementType, props: any) {
	const { key = null, ref = null, ...rest } = props;
	return ReactElement(type, key, ref, rest);
}

export const jsxDEV = jsx;
