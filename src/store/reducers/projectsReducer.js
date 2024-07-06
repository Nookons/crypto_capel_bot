const defaultState = []

export const projectsReducer = (state = defaultState, action) => {
    switch (action.type) {
        case "PROJECTS_FETCH":
            return [...action.payload]

        default:
            return state
    }
}

export const fetchProjectsAction = (payload) => ({type: "PROJECTS_FETCH", payload})