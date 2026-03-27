export interface IAuthService {
  getGoogleUrl(redirectUrl: string): Promise<string>;
  handleGoogleCallback(code: string): Promise<{
    accessToken: string;
    refreshToken: string;
  }>;
  getMe(payload: any): any;
}
