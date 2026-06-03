const success = (res, data = null, message = 'success') => {
  res.json({
    code: 200,
    message,
    data
  });
};

const error = (res, message = 'error', code = 400) => {
  res.status(code).json({
    code,
    message,
    data: null
  });
};

const pagination = (res, list, total, page = 1, pageSize = 10, message = 'success') => {
  res.json({
    code: 200,
    message,
    data: {
      list,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize)
    }
  });
};

module.exports = { success, error, pagination };
