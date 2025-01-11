import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { IS_DEV_ENV } from '../shared/utils/is-dev.util';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver } from '@nestjs/apollo';
import { getGraphQLConfig } from './config/graphql.config';
import { RedisModule } from './redis/redis.module';
import { AccountModule } from '../modules/auth/account/account.module';
import { SessionModule } from '../modules/auth/session/session.module';
import { VerificationModule } from '../modules/auth/verification/verification.module';
import { MailModule } from '../modules/libs/mail/mail.module';
import { PasswordRecoveryModule } from '../modules/auth/password-recovery/password-recovery.module';
import { TotpModule } from '../modules/auth/totp/totp.module';
import { DeactivateModule } from '../modules/auth/deactivate/deactivate.module';

@Module({
  imports: [
    ConfigModule.forRoot({
            ignoreEnvFile: !IS_DEV_ENV,
      isGlobal: true 
    }),
    GraphQLModule.forRootAsync({
      driver: ApolloDriver,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getGraphQLConfig,
    }),
    PrismaModule,
    RedisModule,
    AccountModule,
    SessionModule,
    VerificationModule,
    MailModule,
    PasswordRecoveryModule,
    TotpModule,
    DeactivateModule
  ],
})
export class CoreModule {}
