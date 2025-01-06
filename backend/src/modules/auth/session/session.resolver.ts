import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { SessionService } from './session.service';
import { UserModel } from '../account/models/user.model';
import { GqlContext } from '@/src/shared/types/gql-context.types';
import { LoginInput } from './inputs/login.input';
import { userAgent } from '@/src/shared/decorators/user-agent.decorator';
import { Authorization } from '@/src/shared/decorators/auth.decorator';
import { SessionModel } from './models/session.model';

@Resolver('Session')
export class SessionResolver {
  constructor(private readonly sessionService: SessionService) {}

  @Authorization()
  @Query(() => [SessionModel], {name: 'findSessionsByUser'})
  public async findByUser(@Context() {req}: GqlContext) {
    return this.sessionService.findByUser(req);
  }

  @Authorization()
  @Query(() => SessionModel, {name: 'findCurrentSession'})
  public async findCurrent(@Context() {req}: GqlContext) {
    return this.sessionService.findCurrent(req)
  }

  @Mutation(() => UserModel, {name: 'loginUser'})
  public async login(@Context() {req}: GqlContext, @Args('data') input: LoginInput, @userAgent() userAgent: string) {
    return this.sessionService.login(req, input, userAgent);
  }

  @Authorization()
  @Mutation(() => Boolean, {name: 'logoutUser'})
  public async logout(@Context() {req}: GqlContext) {
    return this.sessionService.logout(req);
  }

  @Authorization()
  @Mutation(() => Boolean, {name: 'clearSessionCookie'})
  public async clearSessionCookie(@Context() {req}: GqlContext) {
    return this.sessionService.clearSessionCookie(req);
  }

  @Authorization()
  @Mutation(() => Boolean, {name: 'removeSession'})
  public async removeSession(@Context() {req}: GqlContext, @Args('id') id: string) {
    return this.sessionService.removeSession(req, id);
  }
}
