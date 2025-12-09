import "express";

declare module "express-serve-staticit-types" {}
declare module "express" {
  interface Request {
    user?: {
      sub: string;
    };
  }
}
