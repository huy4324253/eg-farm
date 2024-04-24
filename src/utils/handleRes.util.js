class ResponseHandler {
    static handleResponse(res, dataOrError, status = 200) {
      if (dataOrError instanceof Error) {
        console.error('Error:', dataOrError.message); // Log the error
        res.status(status).json({ error: dataOrError.message });
      } else {
        console.log('Response Body:', dataOrError); // Log the response body
        res.status(status).json(dataOrError);
      }
    }
  }
  
  module.exports = ResponseHandler;