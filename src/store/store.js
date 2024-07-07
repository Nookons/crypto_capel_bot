import { combineReducers, createStore, applyMiddleware } from 'redux';
import { userReducer } from './reducers/userReducer';
import { projectsReducer } from './reducers/projectsReducer';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk'; // Import `redux-thunk` correctly as default

const rootReducer = combineReducers({
    user: userReducer,
    projects: projectsReducer
});

const middleware = [thunk]; // Define middleware correctly

export const store = createStore(
    rootReducer,
    composeWithDevTools(
        applyMiddleware(...middleware)
    )
);
