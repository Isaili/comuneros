const ACCESS_TOKEN_KEY = 'token';
const REFRESH_TOKEN_KEY = 'refreshToken';

export const tokenStorage = {
  getAccessToken: (): string | null =>
    typeof window === 'undefined' ? null : localStorage.getItem(ACCESS_TOKEN_KEY),

  getRefreshToken: (): string | null =>
    typeof window === 'undefined' ? null : localStorage.getItem(REFRESH_TOKEN_KEY),

  setTokens: (accessToken: string, refreshToken: string): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  },

  clearTokens: (): void => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  },
};
