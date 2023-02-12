import { Container } from 'hostConfig';
import { ReactElement } from 'shared/ReactTypes';
import { FiberNode, FiberRootNode } from './fiber';
import { createUpdate, createUpdateQueue, enqueueUpdate } from './updateQueue';
import { scheduleUpdateOnFiber } from './workLoop';
import { HostRoot } from './workTags';

export function createRoot(container: Container) {
	const root = createContainer(container);
	return {
		render(element: ReactElement) {
			updateContainer(root, element);
		}
	};
}

export function createContainer(container: Container) {
	const hostFiber = new FiberNode(HostRoot, {}, null);
	const root = new FiberRootNode(container, hostFiber);
	return root;
}

export function updateContainer(root: FiberRootNode, element: ReactElement) {
	const hostFiber = root.current;
	const updateQueue = (hostFiber.updateQueue =
		createUpdateQueue<ReactElement>());
	const update = createUpdate<ReactElement>(element);
	enqueueUpdate(updateQueue, update);
	scheduleUpdateOnFiber(hostFiber);
}
