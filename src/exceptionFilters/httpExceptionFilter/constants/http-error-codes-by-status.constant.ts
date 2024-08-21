export const HTTP_ERROR_CODES_BY_STATUS: Record<number, string> = {
  400: 'Invalid request syntax or parameters',
  401: 'Authentication required or failed',
  403: 'Access to the resource is denied',
  404: 'The requested resource could not be found',
  405: 'Method not allowed',
  409: 'Conflict with the current state of the resource',
  413: 'Payload too large',
  429: 'Rate limit exceeded, please try again later',
  500: 'An unexpected error occurred on the server',
  502: 'Bad gateway',
  503: 'The server is currently unable to handle the request',
  504: 'Gateway timeout',
};
