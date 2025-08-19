// import { UserPayload } from 'shared/src/schema/sign-up-schema';
// import jwt from 'jsonwebtoken';

// const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
// const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

// export const generateAccessToken = async (user: UserPayload) => {
//   if (!ACCESS_TOKEN_SECRET) return;

//   const payload = {
//     id: user.id,
//     role: user.role,
//   };

//   const accessToken = await jwt.sign(payload, ACCESS_TOKEN_SECRET, {
//     expiresIn: '1h',
//   });
//   return accessToken;
// };

// export const generteRefreshToken = async (user: UserPayload) => {
//   if (!REFRESH_TOKEN_SECRET) return;
//   const payload = {
//     id: user.id,
//     role: user.role,
//   };

//   const refreshToken = await jwt.sign(payload, REFRESH_TOKEN_SECRET, {
//     expiresIn: '90d',
//   });
//   return refreshToken;
// };
