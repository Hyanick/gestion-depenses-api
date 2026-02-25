import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export type CurrentUserType = { id: string; username: string };

export const CurrentUser = createParamDecorator(
    (_data: unknown, ctx: ExecutionContext): CurrentUserType => {
        const req = ctx.switchToHttp().getRequest();
        return req.user;
    },
);