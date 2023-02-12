import { beginWork } from './beginWork';
import { completeWork } from './completeWork';
import { createWorkInProgress, FiberNode, FiberRootNode } from './fiber';
import { MutationMask, NoFlags } from './fiberFlags';
import { HostRoot } from './workTags';

export let workInProgress: FiberNode | null = null;

export function renderRoot(root: FiberRootNode) {
	prepareFreshStack(root);
	workLoop();
	root.finishedWork = root.current.alternate;
	commitRoot(root);
}

function prepareFreshStack(root: FiberRootNode) {
	workInProgress = createWorkInProgress(root.current, {});
}

function workLoop() {
	while (workInProgress !== null) {
		performUnitOfWork(workInProgress);
	}
}

function performUnitOfWork(workInProgress: FiberNode) {
	const next = beginWork(workInProgress);

	if (next === null) {
		completeUnitOfWork(workInProgress);
	} else {
		workInProgress = next;
	}
}

export function completeUnitOfWork(fiber: FiberNode) {
	let node: FiberNode = fiber;
	while (node) {
		completeWork(node);
		const sibling = node.sibling;
		if (sibling === null) {
			node = node.return!;
		} else {
			workInProgress = sibling;
			return;
		}
	}
}

export function scheduleUpdateOnFiber(fiber: FiberNode) {
	const root = markUpdateFromFiberToRoot(fiber);
	renderRoot(root);
}

export function markUpdateFromFiberToRoot(fiber: FiberNode) {
	let node = fiber;
	let parent = fiber.return;
	while (parent != null) {
		node = parent;
		parent = node.return;
	}
	if (node.tag === HostRoot) {
		return node.stateNode;
	}
	return null;
}

export function commitRoot(root: FiberRootNode) {
	const finishedWork = root.finishedWork;
	root.finishedWork = null;

	if (finishedWork === null) {
		return;
	}
	const subtreeHasEffect =
		(finishedWork.subtreeFlags & MutationMask) !== NoFlags;
	const rootHasEffect = (finishedWork.flags & MutationMask) !== NoFlags;

	if (subtreeHasEffect || rootHasEffect) {
		// 提交副作用
		root.current = finishedWork;
		commitMutationEffects(finishedWork);
	} else {
		root.current = finishedWork;
	}
}
