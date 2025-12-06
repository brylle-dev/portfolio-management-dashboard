import { Request, Response } from "express";
import { CREATED, OK, UNAUTHORIZED } from "../../constants/http";
import { createPortfolio, listPortfolios, overview } from "./portfolio.service";
import catchErrors from "../../utils/catchErrors";

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

export const createPortfolioCtrl = catchErrors(
  async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      res.status(UNAUTHORIZED).json({
        message: "Unauthenticated",
      });
      return;
    }

    const newPortfolio = await createPortfolio(req.user.sub, req.body);
    res.status(CREATED).json(newPortfolio);
  }
);

export const overviewPortfolioCtrl = catchErrors(
  async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      res.status(UNAUTHORIZED).json({
        message: "Unauthenticated",
      });
      return;
    }

    const { id } = req.params;
    console.log("🚀 ~ req.params:", req.params);
    console.log("🚀 ~ ID:", id);
    const data = await overview(id);
    res.status(OK).json(data);
  }
);
