import type { Profile } from '../../../generated/prisma/index.js';

export interface IProfileRepository {
  findById(id: string): Promise<Profile | null>;
  findByEmail(email: string): Promise<Profile | null>;
  upsert(data: {
    id: string;
    email: string;
    displayName?: string;
    photoURL?: string;
    role?: string;
  }): Promise<Profile>;
  ping(): Promise<boolean>;
}
