export const NoFlags = 0b000;
export const Placement = 0b001;
export const Update = 0b010;
export const ChildDeletion = 0b100;

export const MutationMask = Placement | Update | ChildDeletion;

export type Flag =
	| typeof NoFlags
	| typeof Placement
	| typeof Update
	| typeof ChildDeletion;
