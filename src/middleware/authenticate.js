import createHttpError from 'http-errors';
import { Session } from '../models/session.js';
import { User } from '../models/user.js';

export const authenticate = async (req, res, next) => {
  // Support both: httpOnly cookies AND Authorization header
  const tokenFromCookie = req.cookies?.accessToken;
  const tokenFromHeader = req.headers.authorization?.startsWith('Bearer ')
    ? req.headers.authorization.split(' ')[1]
    : null;

  const accessToken = tokenFromCookie || tokenFromHeader;

  if (!accessToken) {
    return next(createHttpError(401, 'Access token is missing'));
  }

  const session = await Session.findOne({ accessToken });
  if (!session) {
    return next(createHttpError(401, 'Session not found'));
  }

  if (new Date() > new Date(session.accessTokenValidUntil)) {
    return next(createHttpError(401, 'Access token expired'));
  }

  const user = await User.findById(session.userId);
  if (!user) {
    return next(createHttpError(401, 'User not found'));
  }

  req.user = user;
  req.session = session;
  next();
};
