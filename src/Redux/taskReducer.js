
const initialState = {
    suppList: [],
    search: '',
    refreshDataSupp: [],
    error: '',
    typeInput: [],
    cateList: [],
    refreshDataCate: [],
    searchCate: '',
    productList: [],
    refreshDataProduct: [],
    searchProduct: '',
    suppIdList: [],
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
        case 'SET_CATE_SEARCH':
            return {
                ...state,
                searchCate: action.payload
            }
        case 'SET_CATE_ADD':
            const updateCateList = [...state.cateList, action.payload];
            return {
                ...state,
                suppList: updateCateList,
            };
        //Product
        case 'SET_PRODUCTLIST':
            return {
                ...state,
                productList: action.payload
            }
        case 'SET_REFRESHDATA_PRODUCT':
            return {
                ...state,
                refreshDataProduct: action.payload,
                productList: action.payload
            }
        case 'SET_SEARCH_PRODUCT':
            return {
                ...state,
                searchProduct: action.payload
            }
        case 'SET_PRODUCT_ADD':
            const updateProductList = [...state.productList, action.payload];
            return {
                ...state,
                productList: updateProductList,
            };
        case 'SET_SUPP_ID' :
            return {
                ...state,
                suppIdList: action.payload
            }
        default:
            return state;
    }
};

export default reducer;
