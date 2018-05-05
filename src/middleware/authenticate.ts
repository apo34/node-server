import express from 'express';
import { IUserDocument, User } from './../models';

export interface IAthenticatedRequest extends express.Request {
  user?: IUserDocument;
  token?: string;
}

export const authenticate = (
  req: IAthenticatedRequest,
  res: express.Response,
  next: express.NextFunction
) => {
  const token = req.header('x-auth') || '';
  User.findByToken(token)
    .then((user) => {
      if (!user) {
        res.status(404).send();
      } else {
        req.user = user;
        req.token = token;
        next();
      }

    })
    .catch(() => {
      res.status(401).send();
    });
};
