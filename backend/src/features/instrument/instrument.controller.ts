import { Request, Response } from "express";
import { listInstruments } from "./instrument.service";
import { OK } from "../../constants/http";
import catchErrors from "../../utils/catchErrors";

export const listInstrumentCtrl = catchErrors(
  async (req: Request, res: Response): Promise<void> => {
    const q = (req.query.q as string | undefined) ?? undefined;
    const rows = await listInstruments(q);
    res.status(OK).json(rows);
  }
);
