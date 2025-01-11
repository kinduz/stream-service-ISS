import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { render } from '@react-email/components';
import { VerificationTemplate } from './templates/verification.template';
import { SessionMetadata } from '@/src/shared/types/session-metadata.types';
import { ResetPasswordTemplate } from './templates/reset-password.template';
import { DeactivationTemplate } from './templates/deactivate.template';
import { DeletionTemplate } from './templates/account-deletion.template';

@Injectable()
export class MailService {
    public constructor (
        private readonly mailerService: MailerService, 
        private readonly configService: ConfigService
    ) {}

    public async sendVerificationToken(to: string, token: string, username: string) {
        const domain = this.configService.getOrThrow<string>("ALLOWED_ORIGIN")
        const html = await render(VerificationTemplate({domain, token, username}));
        
        return this.sendMail(to, 'ISS: верификация аккаунта', html)
    }

    public async sendResetPasswordToken(to: string, token: string, username: string, metadata: SessionMetadata) {
        const domain = this.configService.getOrThrow<string>("ALLOWED_ORIGIN")
        const html = await render(ResetPasswordTemplate({domain, token, username, metadata}));

        return this.sendMail(to, 'ISS: сброс пароля', html);
    }

    public async sendDeactivateToken(to: string, token: string, username: string, metadata: SessionMetadata) {
        const html = await render(DeactivationTemplate({token, username, metadata}));

        return this.sendMail(to, 'ISS: деактивация аккаунта', html);
    }

    public async sendDeletion(to: string, username: string) {
        const html = await render(DeletionTemplate({username}));

        return this.sendMail(to, "ISS: ваш аккаунт был удален", html);
    }

    private sendMail(to: string, subject: string, html: string) {
        return this.mailerService.sendMail({
            to,
            subject,
            html
        })
    }
}
