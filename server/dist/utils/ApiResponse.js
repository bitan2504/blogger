/**
 * ApiResponse class to standardize API responses.
 */
class ApiResponse {
    constructor(statusCode, message, data, success) {
        this.statusCode = statusCode;
        this.message = message;
        this.data = data;
        this.success = success;
    }
}
export default ApiResponse;
