export const FunctionComponent = 0b0001;
export const HostComponent = 0b0010;
export const HostRoot = 0b0100;
export const HostText = 0b1000;

export type WorkTag =
	| typeof FunctionComponent
	| typeof HostComponent
	| typeof HostRoot
	| typeof HostText;
