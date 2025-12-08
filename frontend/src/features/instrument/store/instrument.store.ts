import { create } from "zustand";

interface InstrumentState {
  selectedInstrumentId: string | null;
  setSelectedInstrumentId: (id: string) => void;
}

export const useInstrumentStore = create<InstrumentState>((set) => ({
  selectedInstrumentId: null,
  setSelectedInstrumentId: (id) => set({ selectedInstrumentId: id }),
}));
