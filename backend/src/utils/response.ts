/**
 * @class ApiResponse
 * @description Standardized HTTP Response format builder for AstraFlow.
 * Enforces unified output schemas throughout the application.
 */
export class ApiResponse {
  /**
   * @method success
   * @description Creates a successful response payload.
   * @param res Express Response object
   * @param data Payload data object
   * @param message Informational message
   * @param statusCode HTTP Status Code (default 200)
   */
  static success(res: any, data: any = null, message: string = 'Success', statusCode: number = 200) {
    return res.status(statusCode).json({
      success: true,
      statusCode,
      message,
      data,
    });
  }

  /**
   * @method error
   * @description Creates an error response payload.
   * @param res Express Response object
   * @param message Error description message
   * @param statusCode HTTP Status Code (default 500)
   * @param error Raw error details / stack Trace (optional)
   */
  static error(res: any, message: string = 'Error', statusCode: number = 500, error: any = null) {
    const responseBody: any = {
      success: false,
      statusCode,
      message,
    };

    if (error) {
      responseBody.error = error.message || error;
      if (process.env.NODE_ENV !== 'production' && error.stack) {
        responseBody.stack = error.stack;
      }
    }

    return res.status(statusCode).json(responseBody);
  }
}
