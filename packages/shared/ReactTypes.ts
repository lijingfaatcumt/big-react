export type ElementType = any;
export type Key = any;
export type Ref = any;
export type Props = any;

export interface ReactElement {
	$$typeof: symbol;
	type: ElementType;
	key: Key;
	ref: Ref;
	props: Props;
	__mark__: string;
}

export type Action<State> = State | ((state: State) => State);
