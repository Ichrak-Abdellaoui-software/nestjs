export const jwtConstants = {
  secret: process.env.JWT_SECRET || 'Mobelite',
  expiresIn: '7d',
};
