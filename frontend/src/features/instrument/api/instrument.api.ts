import { api } from "@/lib/client";
import type { Instrument } from "../types/instrument.types";

export const listIntruments = async (): Promise<Instrument[]> => {
  const { data } = await api.get("/instrument");
  return data;
};
