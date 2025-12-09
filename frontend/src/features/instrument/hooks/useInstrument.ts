import { useQuery } from "@tanstack/react-query";
import type { Instrument } from "../types/instrument.types";
import * as api from "../api/instrument.api";

export const useInstrument = () =>
  useQuery<Instrument[]>({
    queryKey: ["instruments"],
    queryFn: api.listIntruments,
  });
