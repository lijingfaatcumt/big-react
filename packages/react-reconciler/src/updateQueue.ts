import { Action } from 'shared/ReactTypes';

export interface Update<State> {
	action: Action<State>;
	next: Update<State> | null;
}

export interface UpdateQueue<State> {
	shared: {
		pending: Update<State> | null;
	};
}

export function createUpdate<State>(action: Action<State>) {
	return {
		action,
		next: null
	};
}

export function createUpdateQueue<State>() {
	return {
		shared: {
			pending: null
		}
	} as UpdateQueue<State>;
}

export function enqueueUpdate<State>(
	updateQueue: UpdateQueue<State>,
	update: Update<State>
) {
	const pending = updateQueue.shared.pending;
	if (pending === null) {
		update.next = update;
	} else {
		update.next = pending.next;
		pending.next = update;
	}
	updateQueue.shared.pending = update;
}

export function processUpdateQueue<State>(
	updateQueue: UpdateQueue<State>,
	initialState: State
) {
	let newState = initialState;
	const pending = updateQueue?.shared.pending;
	if (pending) {
		let update = pending.next;
		while (update) {
			const action = update.action;
			if (action instanceof Function) {
				newState = action(newState);
			} else {
				newState = action;
			}
			update = update.next;
		}
	}
	return {
		memoizedState: newState
	};
}
