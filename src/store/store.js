import { combineReducers, createStore, applyMiddleware } from 'redux';
import { userReducer } from './reducers/userReducer';
import { composeWithDevTools } from 'redux-devtools-extension';
import { thunk } from 'redux-thunk';
import {projectsReducer} from "./reducers/projectsReducer"; // Note: `thunk` is a named import

const rootReducer = combineReducers({
    user: userReducer,
    projects: projectsReducer
});

const middleware = [thunk]; // Define middleware

export const store = createStore(
    rootReducer,
    composeWithDevTools(
        applyMiddleware(...middleware)
    )
);
