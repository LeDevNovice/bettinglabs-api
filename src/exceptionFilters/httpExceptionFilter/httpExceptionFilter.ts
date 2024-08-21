import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { FastifyReply } from 'fastify';
import { Response } from 'express';

import { ExceptionResponse } from './interfaces/http-exception-response.interface';
import { HTTP_ERROR_CODES_BY_STATUS } from './constants/http-error-codes-by-status.constant';

@Catch(Error)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly nodeEnv: string;

  constructor(nodeEnv: string) {
    this.nodeEnv = nodeEnv;
  }

  catch(error: Error, host: ArgumentsHost): any {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    if (this.isFastifyResponse(response)) {
      return this.handleError(error, response as FastifyReply, (res, status) =>
        res.code(status),
      );
    } else {
      return this.handleError(error, response as Response, (res, status) =>
        res.status(status),
      );
    }
  }

  private isFastifyResponse(response: any): boolean {
    return response?.raw !== undefined && typeof response?.code === 'function';
  }

  private handleError(
    error: Error,
    response: FastifyReply | Response,
    setStatus: (response: any, status: number) => any,
  ) {
    if (!(error instanceof HttpException)) {
      this.logError(error);

      // More descriptive error handling based on environment
      const errorDescription =
        this.nodeEnv !== 'production'
          ? error.message || 'Something went wrong'
          : 'Something went wrong';

      return this.sendErrorResponse(
        response,
        setStatus,
        HttpStatus.INTERNAL_SERVER_ERROR,
        errorDescription,
        HTTP_ERROR_CODES_BY_STATUS[HttpStatus.INTERNAL_SERVER_ERROR],
      );
    }

    const exception = error as HttpException;

    try {
      const status = exception.getStatus();
      const obj = this.normalizeExceptionResponse(exception.getResponse());

      // Convert the message to a string if it's an array
      const errorMessage = Array.isArray(obj.message)
        ? obj.message.join(', ')
        : obj.message;

      return this.sendErrorResponse(
        response,
        setStatus,
        status,
        errorMessage,
        obj.error,
      );
    } catch (e: any) {
      this.logError(e);

      // More descriptive error handling based on environment
      const errorDescription =
        this.nodeEnv !== 'production'
          ? e.message || 'Something went wrong'
          : 'Something went wrong';

      return this.sendErrorResponse(
        response,
        setStatus,
        HttpStatus.INTERNAL_SERVER_ERROR,
        errorDescription,
        HTTP_ERROR_CODES_BY_STATUS[HttpStatus.INTERNAL_SERVER_ERROR],
      );
    }
  }

  private logError(error: Error) {
    Logger.error(error.message);
    Logger.error(error.stack);
  }

  private sendErrorResponse(
    response: FastifyReply | Response,
    setStatus: (response: any, status: number) => any,
    statusCode: number,
    errorDescription: string,
    errorCode: string,
  ) {
    return setStatus(response, statusCode).send({
      statusCode,
      errorDescription,
      errorCode,
    });
  }

  private normalizeExceptionResponse(
    response: string | object,
  ): ExceptionResponse {
    if (typeof response === 'string') {
      return { statusCode: 0, status: 0, message: response, error: response };
    }
    return response as ExceptionResponse;
  }
}
