const generateResponse = (success, message, data = null) => {
  return {
    success,
    message,
    data,
  };
};

const generateErrorResponse = (
  message = "Some internal error",
  error = null
) => {
  return {
    success: false,
    message,
    error,
  };
};

module.exports = { generateResponse, generateErrorResponse };
