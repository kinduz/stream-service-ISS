import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../../core/prisma/prisma.service';
import { CreateUserInput } from './inputs/create-user.input';
import { hash } from 'argon2';
import { VerificationService } from '../verification/verification.service';

@Injectable()
export class AccountService {
    public constructor(private readonly prismaService: PrismaService, private readonly verificationService: VerificationService) {}

    public async me(id: string) {
        const user = await this.prismaService.user.findUnique({where: {id}});

        return user;
    }

    public async create(input: CreateUserInput) {
        const {email, username, password} = input;
        
        const isUsernameExists = await this.prismaService.user.findUnique({
            where: {
                username
            }
        })

        if (isUsernameExists) {
            throw new ConflictException("Данное имя пользователя уже занято")
        } 

        const isEmailExists = await this.prismaService.user.findUnique({
            where: {
                email
            }
        })

        if (isEmailExists) {
            throw new ConflictException("Такая электронная почта уже занята")
        }

        const user = await this.prismaService.user.create({
            data: {
                username,
                email,
                password: await hash(password),
                displayName: username
            }
        })

        await this.verificationService.sendVerificationToken(user)

        return true;
    }
}
