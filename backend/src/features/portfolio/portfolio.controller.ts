import { Request, Response } from "express";
import { OK, UNAUTHORIZED } from "../../constants/http";
import { listPortfolios } from "./portfolio.service";

export const listPortfoliosCtrl = async (
  req: Request,
  res: Response
): Promise<void> => {
  if (!req.user) {
    res.status(UNAUTHORIZED).json({
      message: "Unauthenticated",
    });
    return;
  }

  const rows = await listPortfolios(req.user.sub);
  res.status(OK).json(rows);
};
