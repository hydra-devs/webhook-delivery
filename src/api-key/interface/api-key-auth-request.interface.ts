export interface ApiKeyAuthenticatedRequest {
  headers: {
    "x-api-key"?: string;
  };
  accountId: string;
}
