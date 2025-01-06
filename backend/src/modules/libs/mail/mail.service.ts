import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { render } from '@react-email/components';
import { VerificationTemplate } from './templates/verification.template';

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

    private sendMail(to: string, subject: string, html: string) {
        return this.mailerService.sendMail({
            to,
            subject,
            html
        })
    }
}
