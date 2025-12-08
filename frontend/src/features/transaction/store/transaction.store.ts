import { create } from "zustand";

interface PortfolioState {
  selectedPortfolioId: string | null;
  setSelectedPortfolioId: (id: string) => void;
}

export const usePortfolioStore = create<PortfolioState>((set) => ({
  selectedPortfolioId: null,
  setSelectedPortfolioId: (id) => set({ selectedPortfolioId: id }),
}));
