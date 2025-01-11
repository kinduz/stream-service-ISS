import { PrismaService } from '@/src/core/prisma/prisma.service';
import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { MailService } from '../../libs/mail/mail.service';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { TokenType, User } from '@/prisma/generated';
import { destroySession } from '@/src/shared/utils/session.util';
import { generateToken } from '@/src/shared/utils/generate-token.util';
import { getSessionMetadata } from '@/src/shared/utils/session-metadata.util';
import { DeactivateInput } from './inputs/deactivate.input';
import { verify } from 'argon2';
import { TOTP } from 'otpauth';
import { APP_CODE } from '@/src/shared/constants/shared.constants';
 
@Injectable()
export class DeactivateService {
    public constructor (
        private readonly prismaService: PrismaService, 
        private readonly configService: ConfigService,
        private readonly mailService: MailService
    ) {}  

    public async deactivate(req: Request, input: DeactivateInput, user: User, userAgent: string) {
        const {email, password, pin} = input;

        if (user.email !== email) {
            throw new BadRequestException("Неверная почта");
        }

        const isValidPassword = await verify(user.password, password);

        if (!isValidPassword) {
            throw new BadRequestException("Неверный пароль")
        }
        
        if (!pin) {
            await this.sendDeactivateToken(req, user, userAgent);

            return {
                message: "Требуется код подтверждения"
            }
        }

        await this.validateDeactivateToken(req, pin);

        return { user };
    }

    private sendAccountDeletion(user: User) {
        const {email, username} = user;
        return this.mailService.sendDeletion(email, username)
    }
   
    private async validateDeactivateToken(req: Request, token: string) {
        const existingToken = await this.prismaService.token.findUnique({
            where: { 
                token, 
                type: TokenType.DEACTIVATE_ACCOUNT
            }
        })
        
        if (!existingToken) {
            throw new NotFoundException("Токен для деактивации аккаунта не найден");
        }
        
        const isExpired = new Date(existingToken.expiresIn) < new Date();
        
        if (isExpired) {
            throw new BadRequestException("Срок действия токена истек");
        }
        
        const user = await this.prismaService.user.update({
            where: {
                id: existingToken.userId,
            },
            data: {
                isDeactivated: true,
                deactivatedAt: new Date()
            }
        })
                
        await this.prismaService.token.delete({
            where: {
                id: existingToken.id,
                type: TokenType.DEACTIVATE_ACCOUNT
            }
        })

        return destroySession(req, this.configService);
    } 

    async sendDeactivateToken(req: Request, user: User, userAgent: string) {
        const verificationToken = await generateToken(
            this.prismaService, 
            user, 
            TokenType.DEACTIVATE_ACCOUNT,
            false
        );

        const metadata = getSessionMetadata(req, userAgent);

        await this.mailService.sendDeactivateToken(user.email, verificationToken.token, user.username, metadata)
        
        return true;
    }
}