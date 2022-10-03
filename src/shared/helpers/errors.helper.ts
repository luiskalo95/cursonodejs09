import { NextFunction, Request, Response } from 'express';
import { Logger } from './logging.helper';
import { Trace } from './trace.helper';

export interface IError extends Error {
  status?: number;
  traceId?: string;
}

export class HandlerErrors {
  static notFound(req: Request, res: Response, next: NextFunction): void {
    const error: Partial<IError> = new Error('Not Found');
    error.status = 404;
    next(error);
  }

  static catchError(
    ftn: (req: Request, res: Response, next: NextFunction) => Promise<any>
  ): (req: Request, res: Response, next: NextFunction) => Promise<any> {
    return (req: Request, res: Response, next: NextFunction) => {
      return ftn(req, res, next).catch((error) => {
        const err: Partial<IError> = new Error('falla intermitente');
        err.message = error.message;
        err.stack = error.stack;
        err.status = 409;
        next(err);
      });
    };
  }

  static generic(
    error: IError,
    req: Request,
    res: Response,
    next: NextFunction
  ): void {
    const objError: Partial<IError> = {
      traceId: Trace.traceId(),
      name: error.name,
      status: error.status ?? 500,
      message: error.message,
    };
    if (process.env.NODE_ENV !== 'production') {
      objError.stack = error.stack;
    }
    Logger.getLogger().info({
      typeElement: 'Error',
      typeAction: 'Error',
      traceId: objError.traceId,
      message: JSON.stringify(objError),
      query: JSON.stringify(Object.assign(objError, { stack: error.stack })),
      datetime: new Date(),
    });
    res.status(objError.status).json(objError);
  }
}
