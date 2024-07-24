
const defaultState = {
    version_number: "0.0.7",
    version_update_time: 1435135136,
}

export const configReducer = (state = defaultState, action) => {
    switch (action.type) {
        case "CONFIG_FETCH":
            return {...state, ...action.payload};
        default:
            return state;
    }
}

export const fetchProjectDataAction            = (payload) => ({type: "CONFIG_FETCH", payload});

