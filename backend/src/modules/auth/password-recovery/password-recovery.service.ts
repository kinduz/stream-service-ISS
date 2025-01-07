import { PrismaService } from '@/src/core/prisma/prisma.service';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { MailService } from '../../libs/mail/mail.service';
import { Request } from 'express';
import { ResetPasswordInput } from './inputs/reset-password.input';
import { generateToken } from '@/src/shared/utils/generate-token.util';
import { TokenType } from '@/prisma/generated';
import { getSessionMetadata } from '@/src/shared/utils/session-metadata.util';
import { NewPasswordInput } from './inputs/new-password.input';
import { hash, verify } from 'argon2';

@Injectable()
export class PasswordRecoveryService {
    public constructor (private readonly prismaService: PrismaService, private readonly mailService: MailService) {}

    public async resetPassword(req: Request, input: ResetPasswordInput, userAgent: string) {
        const {email} = input;

        const user = await this.prismaService.user.findUnique({
            where: {
                email
            }
        })

        if (!user) {
            throw new NotFoundException("Пользователь не найден");
        }

        const resetToken = await generateToken(this.prismaService, user, TokenType.PASSWORD_RESET);
        const metadata = getSessionMetadata(req, userAgent);

        await this.mailService.sendResetPasswordToken(
            user.email, 
            resetToken.token, 
            user.username, 
            metadata
        );

        return true;
    }

    public async newPassword(input: NewPasswordInput) {
        const {password, token} = input;

        const existingToken = await this.prismaService.token.findUnique({
            where: {
                token, 
                type: TokenType.PASSWORD_RESET
            }
        })
        
        if (!existingToken) {
            throw new NotFoundException("Токен не найден");
        }
        
        const isExpired = new Date(existingToken.expiresIn) < new Date();
        
        if (isExpired) {
            throw new BadRequestException("Срок действия токена истек");
        }

        const user = await this.prismaService.user.findUnique({
            where: {
                id: existingToken.userId
            },
            select: {
                password: true
            }
        })

        const isSamePassword = await verify(user.password, password);;

        if (isSamePassword) {
            throw new BadRequestException("Новый пароль должен отличаться от старого")
        }
        
        await this.prismaService.user.update({
            where: {
                id: existingToken.userId,
            },
            data: {
                password: await hash(password),
            }
        })
                
        await this.prismaService.token.delete({
            where: {
                id: existingToken.id,
                type: TokenType.PASSWORD_RESET
            }
        })
        
        return true;
    }
}
