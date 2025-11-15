import { createParamDecorator, type ExecutionContext } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import type { Request } from "express";
import { GqlContext } from "../types/gql-context.types";

export const UserAgent = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    if (ctx.getType() === 'http') {
      const request: Request = ctx.switchToHttp().getRequest();
      return request.headers['user-agent'];
    }

    const gqlCtx = GqlExecutionContext.create(ctx).getContext<GqlContext>();
    return gqlCtx.req.headers['user-agent'];
  }
)