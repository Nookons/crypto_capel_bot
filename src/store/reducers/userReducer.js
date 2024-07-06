const defaultState = {
    allows_write_to_pm: false,
    first_name: "",
    id: 0,
    language_code: "ru",
    last_name: "",
    username: "",
    favorite: [],
}

export const userReducer = (state = defaultState, action) => {
    switch (action.type) {
        case "USER_ENTER":
            return {
                ...state,
                allows_write_to_pm: action.payload.allows_write_to_pm,
                first_name: action.payload.first_name,
                id: action.payload.id,
                language_code: action.payload.language_code,
                last_name: action.payload.last_name,
                username: action.payload.username
            };

        case "USER_FETCH":
            return {...state, ...action.payload};

        case "ADD_TO_FAVORITE":
            return {...state, favorite: [...state.favorite, Number(action.payload)]};

        case "REMOVE_FAVORITE":
            return {...state, favorite: state.favorite.filter(item => item !== action.payload)};

        default:
            return state;
    }
}

export const fetchUserAction            = (payload) => ({type: "USER_FETCH", payload});

export const addToFavoriteAction        = (payload) => ({type: "ADD_TO_FAVORITE", payload});
export const removeFromFavoriteAction   = (payload) => ({type: "REMOVE_FAVORITE", payload});
