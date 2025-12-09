import { Request, Response } from "express";
import { OK, UNAUTHORIZED } from "../../constants/http";
import { me } from "./user.service";

export const meCtrl = async (req: Request, res: Response): Promise<void> => {
  const userId = (req.user as any)?.sub;
  if (!userId) {
    res.status(UNAUTHORIZED).json({ message: "Not authenticated" });
  }

  const user = await me(userId);

  res.status(OK).json({ user });
};
