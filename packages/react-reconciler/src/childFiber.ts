import { isObject } from 'shared/isObject';
import { REACT_ELEMENT_TYPE } from 'shared/ReactSymbols';
import { ReactElement } from 'shared/ReactTypes';
import { createFiberFromElement, createTextFiber, FiberNode } from './fiber';
import { Placement } from './fiberFlags';

function ChildReconciler(shouldTrackEffects: boolean) {
	function reconcileSingleElement(
		fiber: FiberNode,
		child: FiberNode | null,
		nextChild: ReactElement
	) {
		const newChild = createFiberFromElement(nextChild);
		newChild.return = fiber;
		return newChild;
	}

	function reconcileSingleTextNode(
		fiber: FiberNode,
		child: FiberNode | null,
		nextChild: ReactElement
	) {
		let current = fiber.alternate;
		if (current) {
			current.pendingProps.content = nextChild;
		} else {
			current = createTextFiber(nextChild as unknown as string);
		}

		return current;
	}

	function placeSingleChild(child: FiberNode) {
		if (shouldTrackEffects && child.alternate === null) {
			child.flags |= Placement;
		}
		return child;
	}

	return (
		fiber: FiberNode,
		child: FiberNode | null,
		children: ReactElement
	) => {
		if (isObject(children)) {
			switch (children.$$typeof) {
				case REACT_ELEMENT_TYPE:
					return placeSingleChild(
						reconcileSingleElement(fiber, child, children)
					);
			}
		} else if (typeof children === 'string' || typeof children === 'number') {
			return placeSingleChild(reconcileSingleTextNode(fiber, child, children));
		}
		return null;
	};
}

export const mountChildFibers = ChildReconciler(false);
export const reconcileChildFibers = ChildReconciler(true);
