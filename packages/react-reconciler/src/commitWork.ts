import { FiberNode } from './fiber';
import { MutationMask, Placement } from './fiberFlags';
import { Container, appendChildToContainer } from './hostConfig';
import { HostComponent, HostRoot, HostText } from './workTags';

export function commitMutationEffects(finishedWork: FiberNode) {
	let node = finishedWork;
	while (node !== null) {
		let child = node.child;
		if (node.subtreeFlags & MutationMask && child) {
			node = child;
			child = node.child;
		} else {
			commitMutationEffectsOnFiber(node);
			let sibling;
			do {
				sibling = node.sibling;
				if (sibling) {
					node = sibling;
					break;
				} else {
					node = node.return!;
				}
			} while (node !== null);
		}
	}
}

function commitMutationEffectsOnFiber(fiber: FiberNode) {
	if (fiber.flags & Placement) {
		const parent = getParentContainer(fiber);
		appendPlacementNodeToContainer(fiber, parent);
	}
}

function getParentContainer(fiber: FiberNode) {
	let node = fiber.return;
	while (node) {
		if (node.tag === HostComponent) {
			return node.stateNode as Container;
		} else if (node.tag === HostRoot) {
			return node.stateNode.container as Container;
		} else {
			node = node.return;
		}
	}
	return null;
}

function appendPlacementNodeToContainer(
	fiber: FiberNode,
	container: Container
) {
	if (fiber.tag === HostComponent || fiber.tag === HostText) {
		appendChildToContainer(fiber.stateNode, container);
	} else {
		let child = fiber.child;
		while (child) {
			appendPlacementNodeToContainer(child, container);
			child = child.sibling;
		}
	}
}
