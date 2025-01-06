import { PrismaService } from '@/src/core/prisma/prisma.service';
import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { LoginInput } from './inputs/login.input';
import { verify } from 'argon2';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { getSessionMetadata } from '@/src/shared/utils/session-metadata.util';
import { RedisService } from '@/src/core/redis/redis.service';
import { getSessionKey } from '@/src/shared/utils/get-session-key.util';
import { destroySession, saveSession } from '@/src/shared/utils/session.util';
import { VerificationService } from '../verification/verification.service';

@Injectable()
export class SessionService {
    public constructor(
        private readonly prismaService: PrismaService, 
        private readonly configService: ConfigService, 
        private readonly redisService: RedisService,
        private readonly verificationService: VerificationService
    ) {}

    public async findByUser(req: Request) {
        const userId = req.session.userId;

        if (!userId) {
            throw new NotFoundException("Пользователь не обнаружен")
        }

        const keys = await this.redisService.keys("*");

        const userSessions = [];

        for (const key of keys) {
            const sessionData = await this.redisService.get(key);

            if (sessionData) {
                const session = JSON.parse(sessionData);

                if (session.userId === userId) {
                    userSessions.push({
                        ...session,
                        id: key.split(":")[1]
                    })
                }
            }
        }

        userSessions.sort((a, b) => b.createdAt - a.createdAt);

        return userSessions.filter(session => session.id !== req.session.id);
    }

    public async findCurrent(req: Request) {
        const sessionId = req.session.id;
        const key = getSessionKey(sessionId, this.configService);

        const sessionData = await this.redisService.get(key);

        const session = JSON.parse(sessionData);

        return {
            ...session,
            id: sessionId
        }
    }

    public async login(req: Request, input: LoginInput, userAgent: string) {
        const {login, password} = input;

        const user = await this.prismaService.user.findFirst({
            where: {
                OR: [
                    {
                        username: {equals: login}
                    },
                    {
                        email: {equals: login}
                    }
                ]
            }
        })

        if (!user) {
            throw new NotFoundException("Пользователь не найден");
        }

        if (!user.isEmailVerified) {
            await this.verificationService.sendVerificationToken(user);
            
            throw new BadRequestException("Ваш аккаунт не подтвержден. Проверьте вашу электронную почту для подтверждения аккаунта");
        }

        const isValidPassword = await verify(user.password, password);

        if (!isValidPassword) {
            throw new UnauthorizedException("Неверный пароль")
        }

        const metadata = getSessionMetadata(req, userAgent)

        return saveSession(req, user, metadata);
    }

    public async logout(req: Request) {
        return destroySession(req, this.configService)
    }

    public async clearSessionCookie(req: Request) {
        req.res.clearCookie(this.configService.getOrThrow<string>("SESSION_NAME"));

        return true;
    }

    public async removeSession(req: Request, id: string) {
        if (req.session.id === id) {
            throw new ConflictException("Вы не можете удалить текущую сессию")
        }

        const key = getSessionKey(id, this.configService);

        await this.redisService.del(key)

        return true;
    }

}
