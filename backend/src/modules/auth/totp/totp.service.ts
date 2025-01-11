import { User } from '@/prisma/generated';
import { PrismaService } from '@/src/core/prisma/prisma.service';
import { APP_CODE } from '@/src/shared/constants/shared.constants';
import { BadRequestException, Injectable } from '@nestjs/common';
import { randomBytes } from 'crypto';
import { encode } from 'hi-base32';
import { TOTP } from 'otpauth';
import * as QRCode from "qrcode";
import { EnableTotpInput } from './inputs/enable-totp.input';

@Injectable()
export class TotpService {
    public constructor(private readonly prismaService: PrismaService) {}

    public async generate(user: User) {
        const secret = encode
        (
            randomBytes(15))
            .replace(/=/g, "")
            .substring(0, 24
        );

        const totp = new TOTP({
            issuer: APP_CODE,
            label: user.email,
            algorithm: 'SHA1',
            digits: 6,
            secret,
        })

        const otpAuthUrl = totp.toString();
        const qrcodeUrl = await QRCode.toDataURL(otpAuthUrl);

        return { qrcodeUrl, secret }
    }

    public async enable(user: User, input: EnableTotpInput) {
        const {secret, pin} = input;

        const totp = new TOTP({
            issuer: APP_CODE,
            label: user.email,
            algorithm: 'SHA1',
            digits: 6,
            secret,
        })    

        const isValidate = totp.validate({token: pin});

        if (!isValidate) {
            throw new BadRequestException("Неверный код");
        }


        await this.prismaService.user.update({
            where: {
                id: user.id
            },
            data: {
                isTotpEnabled: true,
                totpSecret: secret
            }
        });

        return true;
    }

    public async disable(user: User) {
        await this.prismaService.user.update({
            where: {
                id: user.id
            },
            data: {
                isTotpEnabled: false,
                totpSecret: null
            }
        })

        return true;
    }
}
