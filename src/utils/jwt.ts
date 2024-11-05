import { jwtDecode } from 'jwt-decode';

export interface DecodedToken {
  exp: number;
  role: string;
  name: string | null;
}

export function decodeToken(token: string): DecodedToken | null {
  try {
    return jwtDecode<DecodedToken>(token);
  } catch (error) {
    console.error('Invalid token:', error);
    return null;
  }
}

export function isTokenExpired(token: string): boolean {
  try {
    const decoded = jwtDecode<DecodedToken>(token);
    const currentTime = Date.now() / 1000;
    return decoded.exp < currentTime;
  } catch (error) {
    return true; // token 無法解碼或解析出錯，視為過期
  }
}