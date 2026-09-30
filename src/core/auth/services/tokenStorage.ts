const ACCESS_TOKEN_KEY = 'token';

// El refresh token vive en una cookie httpOnly que pone el backend; JS no debe
// leerlo ni guardarlo, por eso aquí solo se maneja el access token.
export const tokenStorage = {
  getAccessToken: (): string | null =>
    typeof window === 'undefined' ? null : localStorage.getItem(ACCESS_TOKEN_KEY),

  setAccessToken: (accessToken: string): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  },

  clearAccessToken: (): void => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(ACCESS_TOKEN_KEY);
  },
};

