import crypto from 'crypto';
import { FIFTEEN_MINUTES, SEVEN_DAYS } from '../constants/time.js';
import { Session } from '../models/session.js';

export const createSession = async (userId) => {
  // Delete existing sessions for the user to ensure only one active session at a time
  await Session.deleteMany({ userId });

  const accessToken = crypto.randomBytes(30).toString('base64');
  const refreshToken = crypto.randomBytes(30).toString('base64');

  return Session.create({
    userId,
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
    refreshTokenValidUntil: new Date(Date.now() + SEVEN_DAYS),
  });
};

export const setSessionCookies = (res, session) => {
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'none',
  };

  res.cookie('accessToken', session.accessToken, {
    ...cookieOptions,
    maxAge: FIFTEEN_MINUTES,
  });
  res.cookie('refreshToken', session.refreshToken, {
    ...cookieOptions,
    maxAge: SEVEN_DAYS,
  });
  res.cookie('sessionId', session._id.toString(), {
    ...cookieOptions,
    maxAge: SEVEN_DAYS,
  });
};

export const clearSessionCookies = (res) => {
  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');
  res.clearCookie('sessionId');
};
