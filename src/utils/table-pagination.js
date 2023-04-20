// Helper function to calculate the pagination range
function calculateRange(data, perPage) {
    const pages = Math.ceil(data.length / perPage);
    const pagination = Array.from({ length: pages }, (_, i) => i + 1);
    return pagination;
}

// Helper function to slice data based on current page and items per page
function sliceData(data, currentPage, perPage) {
    const startIndex = (currentPage - 1) * perPage;
    const endIndex = startIndex + perPage;
    return data.slice(startIndex, endIndex);
}
export {
    calculateRange,
    sliceData
}