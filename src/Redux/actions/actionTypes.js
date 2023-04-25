export const SET_CURRENT_PAGE = "SET_CURRENT_PAGE";
export const SET_ITEMS_PER_PAGE = "SET_ITEMS_PER_PAGE";
export const SET_TOTAL_ITEMS = "SET_TOTAL_ITEMS";

export const setCurrentPage = (page) => ({
  type: SET_CURRENT_PAGE,
  payload: page,
});

export const setItemsPerPage = (itemsPerPage) => ({
  type: SET_ITEMS_PER_PAGE,
  payload: itemsPerPage,
});

export const setTotalItems = (totalItems) => ({
  type: SET_TOTAL_ITEMS,
  payload: totalItems,
});
