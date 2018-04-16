import { Action, createSelector, createFeatureSelector, State } from '@ngrx/store';
import { TasksAction, TasksActionTypes } from '../actions/task.actions';
import { ITask } from '../../common/models';

// --------------------------------------------------------------------------------------------------------------------
// Store
// --------------------------------------------------------------------------------------------------------------------

// The AuthState iterface describes the structure of the auth store we create
export interface ITaskState {
    tasks: ITask[];
    selectedTaskId: string;
    tasksById: ITask[];
}

// The initial state of the auth store
const initialState: ITaskState = {
    tasks: [],
    selectedTaskId: null,
    tasksById: []
}

// --------------------------------------------------------------------------------------------------------------------
// Reducer
// --------------------------------------------------------------------------------------------------------------------

/**
 * Reducer is a pure function, with input-output only and no side effects. 
 * This is the only one who is allowed to update the state directly, it must return the updated state.
 * It will be called automatically in response to store.dispatch() of any action named above.
 * Important: state object MUST be immutable.
 * @param state The previous state.
 * @param action The Action to apply to the state.
 */
export function reducer(
    state: ITaskState = initialState,
    action: TasksAction
): ITaskState {

    switch (action.type) {

        // case TasksActionTypes.TASK_ADD_TASK:
        // return state;

        case TasksActionTypes.TASK_SELECT:
            console.log('Reducer :: Task Select ::', action.payload);
            return { ...state, selectedTaskId: action.payload }

        case TasksActionTypes.TASK_LOAD_SUCCESS:
            console.log('Reducer :: Load Task Success ::', action.payload);
            return { ...state, tasks: { ...state.tasks, ...action.payload } }

        case TasksActionTypes.TASKS_LOAD_SUCCESS:
            console.log('Reducer :: Load Tasks Success ::', action.payload);
            return { ...state, tasks: { ...state.tasks, ...action.payload } }

        case TasksActionTypes.TASK_CREATE_SUCCESS:
            console.log('Reducer :: Create Tasks Success ::', action.payload);
            const task: ITask = action.payload;
            state = {
                ...state,
                tasks: [...state.tasks, task],
                tasksById: [...[state.tasksById[task._id] = task]],
                selectedTaskId: task._id
            }
            return state;

        default:
            return state;
    }
}

// --------------------------------------------------------------------------------------------------------------------
// Selector functions are used to access the slices of the state from application
// More info on 'createFeatureSelector' and 'createSelector' can be found here:
// https://github.com/ngrx/platform/blob/master/docs/store/selectors.md
// --------------------------------------------------------------------------------------------------------------------

// This 'feature' selector selects auth store itself as a feature to be reused in other selectors
export const getTasksState = createFeatureSelector<ITaskState>('tasksState');
export const getTasks = createSelector(getTasksState, (state: ITaskState) => state.tasks);
export const getSelectedTaskId = createSelector(getTasksState, (state: ITaskState) => state.selectedTaskId);
export const getSelectedTask = createSelector(getTasksState, getSelectedTaskId,
    (state: ITaskState, selectedTaskId: string) => state.tasksById[selectedTaskId]
);