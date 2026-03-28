import prisma from '../../db/prisma.js';
import type { IProfileRepository } from './interfaces/IProfileRepository.js';

export class ProfileRepository implements IProfileRepository {
  // --- PROFILE ---
  async findById(id: string) {
    return prisma.profile.findUnique({ where: { id } });
  }

  async findByEmail(email: string) {
    return prisma.profile.findUnique({ where: { email } });
  }

  async upsert(data: {
    id: string;
    email: string;
    displayName?: string;
    photoURL?: string;
    role?: string;
  }) {
    return prisma.profile.upsert({
      where: { id: data.id },
      update: {
        displayName: data.displayName ?? null,
        photoURL: data.photoURL ?? null,
      },
      create: {
        id: data.id,
        email: data.email,
        displayName: data.displayName ?? null,
        photoURL: data.photoURL ?? null,
        role: data.role ?? 'user',
      },
    });
  }

  // --- HEALTH CHECK ---
  async ping() {
    await prisma.$queryRaw`SELECT 1`;
    return true;
  }
}

// Keep export default for backward compatibility (temporarily or permanently)
const profileRepo = new ProfileRepository();
export default profileRepo;
