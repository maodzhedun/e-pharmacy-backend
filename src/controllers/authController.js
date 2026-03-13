import bcrypt from 'bcrypt';
import createHttpError from 'http-errors';
import { User } from '../models/user.js';
import { Session } from '../models/session.js';
import { createSession, setSessionCookies, clearSessionCookies } from '../services/auth.js';

// POST /api/user/login
export const loginUser = async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return next(createHttpError(401, 'Email or password is wrong'));
  }

  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    return next(createHttpError(401, 'Email or password is wrong'));
  }

  const session = await createSession(user._id);
  setSessionCookies(res, session);

  // Return both the token (for Bearer) and the cookies (for httpOnly)
  res.status(200).json({ token: session.accessToken, user });
};

// POST /api/user/logout
export const logoutUser = async (req, res) => {
  const { sessionId } = req.cookies;
  if (sessionId) {
    await Session.deleteOne({ _id: sessionId });
  }

  // Also delete based on the Bearer token (if it was sent via the header)
  const tokenFromHeader = req.headers.authorization?.split(' ')[1];
  if (tokenFromHeader) {
    await Session.deleteOne({ accessToken: tokenFromHeader });
  }

  clearSessionCookies(res);
  res.status(200).json({ message: 'Logout successful' });
};

// GET /api/user/user-info
export const getUserInfo = async (req, res) => {
  const { name, email } = req.user;
  res.status(200).json({ name, email });
};

// POST /api/user/refresh
export const refreshUserSession = async (req, res, next) => {
  const session = await Session.findOne({
    _id: req.cookies.sessionId,
    refreshToken: req.cookies.refreshToken,
  });

  if (!session) {
    return next(createHttpError(401, 'Session not found'));
  }

  if (new Date() > new Date(session.refreshTokenValidUntil)) {
    return next(createHttpError(401, 'Refresh token expired'));
  }

  await Session.deleteOne({ _id: session._id });
  const newSession = await createSession(session.userId);
  setSessionCookies(res, newSession);

  res.status(200).json({ message: 'Session refreshed', token: newSession.accessToken });
};
