
const initialState = {
    suppList: [],
    search: '',
    refreshDataSupp: [],
    error: '',
};

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
                suppList: action.payload, // update suppList when refreshDataSupp is set
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

console.log(reducer);

export default reducer;
