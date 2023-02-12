import { ReactElement } from 'shared/ReactTypes';
import { mountChildFibers, reconcileChildFibers } from './childFiber';
import { FiberNode } from './fiber';
import { processUpdateQueue } from './updateQueue';
import { HostComponent, HostRoot, HostText } from './workTags';

export function beginWork(fiber: FiberNode) {
	const workTag = fiber.tag;
	switch (workTag) {
		case HostRoot:
			return updateHostRoot(fiber);
		case HostComponent:
			return updateHostComponent(fiber);
		case HostText:
			return null;
	}
	return null;
}

export function updateHostRoot(fiber: FiberNode) {
	const { updateQueue, memoizedState: initialState } = fiber;
	const { memoizedState } = processUpdateQueue(updateQueue!, initialState);
	updateQueue!.shared.pending = null;
	fiber.memoizedState = memoizedState;
	reconcileChildren(fiber, memoizedState);
	return fiber.child;
}

export function updateHostComponent(fiber: FiberNode) {
	const {
		pendingProps: { children }
	} = fiber;

	if (children) {
		return reconcileChildren(fiber, children);
	}
	return null;
}

export function reconcileChildren(
	returnFiber: FiberNode,
	children: ReactElement
) {
	const current = returnFiber.alternate;
	let childFiber = null;
	if (current) {
		childFiber = reconcileChildFibers(returnFiber, current.child, children);
	} else {
		childFiber = mountChildFibers(returnFiber, null, children);
	}
	if (childFiber) {
		childFiber.return = returnFiber;
	}
	return childFiber;
}
