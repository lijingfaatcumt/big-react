import { ElementType, Key, Props, ReactElement } from 'shared/ReactTypes';
import { Flag, NoFlags } from './fiberFlags';
import { Container } from 'hostConfig';
import { UpdateQueue } from './updateQueue';
import { HostText, WorkTag } from './WorkTags';
import { FunctionComponent, HostComponent } from './workTags';

function getReactElementTag(type: ElementType) {
	if (typeof type === 'string' || typeof type === 'number') {
		return HostComponent;
	} else if (type instanceof Function) {
		return FunctionComponent;
	}
	return HostComponent;
}

export class FiberNode {
	tag: WorkTag;
	pendingProps: Props;
	key: Key;
	memoizedProps: Props | null;
	memoizedState: any;
	updateQueue: UpdateQueue<any> | null;

	return: FiberNode | null;
	sibling: FiberNode | null;
	child: FiberNode | null;
	index: number;

	alternate: FiberNode | null;

	flags: Flag;
	subtreeFlags: Flag;

	stateNode: any;

	type: any;

	constructor(tag: WorkTag, pendingProps: Props, key: Key) {
		this.tag = tag;
		this.key = key;

		this.pendingProps = pendingProps;
		this.memoizedProps = null;
		this.memoizedState = null;
		this.updateQueue = null;

		this.return = null;
		this.sibling = null;
		this.child = null;
		this.index = 0;

		this.alternate = null;

		this.flags = NoFlags;
		this.subtreeFlags = NoFlags;

		this.stateNode = null;
		this.type = null;
	}
}

export class FiberRootNode {
	container: Container;
	current: FiberNode;
	finishedWork: FiberNode | null;

	constructor(container: Container, hostFiber: FiberNode) {
		this.container = container;
		this.current = hostFiber;
		hostFiber.stateNode = this;
		this.finishedWork = null;
	}
}

export function createWorkInProgress(current: FiberNode, pendingProps: Props) {
	let wip = current.alternate;
	if (wip) {
		wip.pendingProps = pendingProps;
	} else {
		wip = new FiberNode(current.tag, pendingProps, current.key);
		wip.alternate = current;
		current.alternate = wip;
	}
	wip.child = null;
	wip.sibling = null;
	wip.index = 0;
	wip.key = current.key;
	wip.memoizedProps = null;
	wip.memoizedState = null;
	wip.flags = NoFlags;
	wip.subFlags = NoFlags;
	wip.type = current.type;

	return wip;
}

export function createTextFiber(text: string | number) {
	return new FiberNode(HostText, { content: String(text) }, null);
}

export function createFiberFromElement(element: ReactElement) {
	const { type, props, key } = element;
	const tag = getReactElementTag(type);
	const fiber = new FiberNode(tag, props, key);
	fiber.type = type;

	return fiber;
}
