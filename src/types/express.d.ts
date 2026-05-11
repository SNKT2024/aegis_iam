import type { Request } from "express";

export type User = {
  userId: string;
  email: string;
  roles: string[];
};

export interface UserObject extends Request {
  user?: User;
}
