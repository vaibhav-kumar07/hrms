export function applyPagination(pagination: { page?: number; pageSize?: number }) {
    let { page = 1, pageSize = 20 } = pagination || {};
    if (page < 1) {
        page = 1;
    }
    const limit = Math.min(parseInt(pageSize.toString(), 10) || 20, 500);
    const skip = (page - 1) * limit;
    return { skip, limit };
}

export function applySort(sort: string) {
    const sortArray = sort.split(',');
    const sortObj: any = {};
    sortArray.forEach((sortItem) => {
        const [key, order] = sortItem.split(':');
        sortObj[key] = order === 'asc' ? 1 : -1;
    });
    return sortObj;
}
