import { FiberNode } from './fiber';
import {
	createInstance,
	createTextInstance,
	appendInitialChild
} from 'hostConfig';
import { HostComponent, HostRoot, HostText } from './workTags';

export function completeWork(fiber: FiberNode) {
	const { tag, pendingProps, type } = fiber;
	switch (tag) {
		case HostComponent: {
			if (fiber.alternate !== null) {
				// 更新阶段
			} else {
				const instance = createInstance(type, pendingProps);
				fiber.stateNode = instance;
				appendAllInitialChildren(instance, fiber);
			}
			break;
		}

		case HostRoot: {
			const instance = createTextInstance(pendingProps.content);
			fiber.stateNode = instance;
			break;
		}

		case HostText:
			break;
	}
	bubbleProperties(fiber);
}

function appendAllInitialChildren(parent: any, fiber: FiberNode) {
	let node = fiber.child;

	while (node && node !== fiber) {
		if (node.tag === HostComponent || node.tag === HostText) {
			appendInitialChild(parent, node.stateNode);
			node = node.sibling;
			continue;
		} else if (node.child) {
			node = node.child;
		} else {
			let sibling;
			do {
				node = node.return!;
				sibling = node.sibling;
				if (sibling !== null) {
					node = sibling;
					break;
				}
			} while (sibling === null);
		}
	}
}

export function bubbleProperties(fiber: FiberNode) {
	const returnFiber = fiber.return;
	if (returnFiber) {
		returnFiber.subtreeFlags |= fiber.subtreeFlags | fiber.flags;
	}
}
