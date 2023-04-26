
const initialState = {
    suppList: [],
    search: '',
    refreshDataSupp: [],
    error: '',
    typeInput: [],
    cateList: [],
    refreshDataCate: [],
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
        case 'SET_CHANGE_INPUT':
            return {
                ...state,
                typeInput: action.payload,
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
        case 'SET_SUPP_ADD':
            const updatedSuppList = [...state.suppList, action.payload];
            return {
                ...state,
                suppList: updatedSuppList,
            };
        // Category
        case 'SET_CATE_LIST':
            return {
                ...state,
                cateList: action.payload
            };
        case 'SET_CATE_REfRESHDATA':
            return {
                ...state,
                refreshDataCate: action.payload,
                cateList: action.payload
            }
        default:
            return state;
    }
};

export default reducer;
