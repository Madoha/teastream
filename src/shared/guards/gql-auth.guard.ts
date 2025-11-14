import { PrismaService } from "@/src/core/prisma/prisma.service";
import { type CanActivate, type ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";

interface Session {
  userId: string;
}

interface  Request {
  session: Session;
  user?: any;
}

@Injectable()
export class GqlAuthGuard implements CanActivate {
  constructor(private readonly prismaService: PrismaService) {

  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context).getContext<{ req: Request }>();
    const request = ctx.req;

    if (typeof request.session.userId === 'undefined') {
      throw new UnauthorizedException('User not authenticated')
    }

    const user = await this.prismaService.user.findUnique({
      where: {
        id: request.session.userId
      }
    })

    request.user = user;
    return true;
  }
}