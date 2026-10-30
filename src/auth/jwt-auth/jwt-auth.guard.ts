import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

interface JwtPayload {
  sub: string;
  accountId: string;
  role: string;
}

interface AuthenticatedRequest {
  headers: {
    authorization?: string;
  };
  user?: {
    userId: string;
    accountId: string;
    role: string;
  };
}

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();

    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new UnauthorizedException("Missing authorization header");
    }

    const token = authHeader.split(" ")[1];

    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(token);

      request.user = {
        userId: payload.sub,
        accountId: payload.accountId,
        role: payload.role,
      };
      return true;
    } catch {
      throw new UnauthorizedException("Invalid or expired token");
    }
  }
}
