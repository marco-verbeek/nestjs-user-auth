import { Request, Response, NextFunction } from 'express';

export function logger(req: Request, res: Response, next: NextFunction) {
  const { method, originalUrl } = req;
  const start = Date.now();

  res.on('finish', () => {
    const { statusCode } = res;
    const delay = Date.now() - start;

    console.log(`${method} ${originalUrl} ${statusCode} ${delay}ms`);
  });

  next();
}
