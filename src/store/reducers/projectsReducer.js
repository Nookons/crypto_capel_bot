const defaultState = []

export const projectsReducer = (state = defaultState, action) => {
    switch (action.type) {
        case "PROJECTS_FETCH":
            return [...action.payload]

        case "ADD_LIKE":
            return state.map(item => {
                if (item.id === action.payload) {
                    return {
                        ...item,
                        likes: item.likes + 1
                    };
                }
                return item;
            });
        case "REMOVE_LIKE":
            return state

        default:
            return state
    }
}

export const fetchProjectsAction = (payload) => ({type: "PROJECTS_FETCH", payload})
export const addLikeAction = (payload) => ({type: "ADD_LIKE", payload})
export const removeLikeAction = (payload) => ({type: "REMOVE_LIKE", payload})