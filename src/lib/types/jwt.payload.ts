export type JwtPayload = {
  id: string;
  exp: number;
};

export type EnrichedJwtPayload = JwtPayload & {
  role: string;
};
