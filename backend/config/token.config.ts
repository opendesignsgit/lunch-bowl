import jwt from 'jsonwebtoken';

// Secret key for signing the JWT tokens (use environment variable for production)
const JWT_SECRET = process.env.JWT_SECRET || 'app-key';  // You should keep this secret in environment variables

// Token expiration times
const ACCESS_TOKEN_EXPIRATION = '1h';   // 1 hour for access token
const REFRESH_TOKEN_EXPIRATION = '30d'; // 30 days for refresh token

// Function to generate access token (short-lived)
export const generateAccessToken = (user: any): string => {
  const payload = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };

  return jwt.sign(payload, JWT_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRATION });
};

// Function to generate refresh token (long-lived)
export const generateRefreshToken = (user: any): string => {
  const payload = {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
  };

  return jwt.sign(payload, JWT_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRATION });
};

// Function to verify and decode refresh token
export const verifyRefreshToken = (token: string): any => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    throw new Error('Invalid or expired refresh token');
  }
};
