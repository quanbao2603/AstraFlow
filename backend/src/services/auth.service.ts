import supabase from '../db/supabase.js';
import type { IProfileRepository } from '../interfaces/IProfileRepository.js';
import type { IAuthService } from '../interfaces/IAuthService.js';

export class AuthService implements IAuthService {
  constructor(private readonly profileRepo: IProfileRepository) {}

  async getGoogleUrl(redirectUrl: string): Promise<string> {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectUrl,
      },
    });

    if (error) throw error;
    if (!data || !data.url) throw new Error('Failed to create OAuth URL');
    
    return data.url;
  }

  async handleGoogleCallback(code: string): Promise<{ accessToken: string; refreshToken: string }> {
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) throw error;

    const { session, user } = data;
    if (!session || !user) throw new Error('No session or user returned');

    await this.profileRepo.upsert({
      id: user.id,
      email: user.email!, // Supabase Auth usually guarantees email for google provider
      displayName: user.user_metadata.full_name || user.user_metadata.name,
      photoURL: user.user_metadata.avatar_url || user.user_metadata.picture,
    });

    return {
      accessToken: session.access_token,
      refreshToken: session.refresh_token,
    };
  }

  getMe(payload: any) {
    return {
      id: payload.sub,
      email: payload.email,
      displayName: payload.user_metadata?.full_name || payload.user_metadata?.name || payload.email,
      photoURL: payload.user_metadata?.avatar_url || payload.user_metadata?.picture || null,
      role: payload.role || 'authenticated',
    };
  }
}
