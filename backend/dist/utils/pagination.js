export const getPagination = (pageParam, limitParam) => {
    const page = Math.max(Number(pageParam) || 1, 1);
    const limit = Math.min(Math.max(Number(limitParam) || 10, 1), 100);
    const skip = (page - 1) * limit;
    return {
        page,
        limit,
        skip,
    };
};
export const getPaginationMeta = (page, limit, total) => {
    const totalPages = Math.ceil(total / limit);
    return {
        page,
        limit,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
    };
};
