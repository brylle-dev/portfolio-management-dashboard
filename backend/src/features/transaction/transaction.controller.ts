import { Request, Response } from "express";
import { createTxn, listTxns } from "./transaction.service";
import { OK } from "../../constants/http";

export const listTxnCtrl = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { portfolioId } = req.params;

  const rows = await listTxns(portfolioId);
  res.status(OK).json(rows);
};

export const createTxnCtrl = async (
  req: Request,
  res: Response
): Promise<void> => {
  const result = await createTxn(req.body);

  res.status(OK).json(result);
};
