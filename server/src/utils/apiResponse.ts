const apiResponse = (
  success: boolean,
  message: string,
  data: object = {},
  error: string = ""
) => {
  return {
    success,
    message,
    data,
    error,
  };
};

export default apiResponse;
