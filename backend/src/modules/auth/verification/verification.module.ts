import { Module } from '@nestjs/common';
import { VerificationService } from './verification.service';
import { VerificationResolver } from './verification.resolver';
import { PrismaService } from '@/src/core/prisma/prisma.service';

@Module({
  providers: [VerificationResolver, VerificationService],
})
export class VerificationModule {}
