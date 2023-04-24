import { createStore } from "redux";

const initialState = {
    suppList: [],
    search: '',
    refreshDataSupp: [],
    error: '',
};

const store = createStore(reducer);

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_SUPPLIST':
            return {
                ...state,
                suppList: action.payload,
            };
        case 'SET_SEARCH':
            return {
                ...state,
                search: action.payload,
            };
        case 'SET_REFRESHDATA':
            return {
                ...state,
                refreshDataSupp: action.payload,
            };
        case 'SET_ERROR':
            return {
                ...state,
                error: action.payload,
            };
        default:
            return state;
    }
};

export default reducer;
