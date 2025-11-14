import type { User } from "@/prisma/generated/prisma/client";
import { createParamDecorator, type ExecutionContext } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";

export const Authorized = createParamDecorator(
  (data: keyof User, ctx: ExecutionContext) => {
    let user: User;

    if (ctx.getType() === 'http') {
      const req = ctx.switchToHttp().getRequest<{ user: User }>()
      user = req.user;
    } else {
      const gqlContext = GqlExecutionContext.create(ctx).getContext<{ req: { user: User } }>();
      user = gqlContext.req.user;
    }

    return data ? user[data] : user
  }
)