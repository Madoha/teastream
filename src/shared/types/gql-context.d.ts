import type { Request, Response } from "express";

export interface GqlContext {
  req: Request
  req: Response
}