export interface JwtPayload {
  sub: string;
  accountId: string;
  role: string;
}

export interface AuthenticatedRequest {
  headers: {
    authorization?: string;
  };
  user?: {
    userId: string;
    accountId: string;
    role: string;
  };
}
