import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { Request } from "express";

export const UserAgent = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
    if (ctx.getType() === 'http') {
        const req: Request = ctx.switchToHttp().getRequest();
        return req.headers['user-agent'];
    } else {
        const context = GqlExecutionContext.create(ctx);
        return context.getContext().req.headers['user-agent'];
    }
})