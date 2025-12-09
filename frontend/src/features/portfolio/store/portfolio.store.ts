import { create } from "zustand";

interface PortfolioUIState {
  selectedPortfolioId: string | null;
  isCreateModalOpen: boolean;
  setSelectedPortfolioId: (id: string | null) => void;
  openCreateModal: () => void;
  closeCreateModal: () => void;
}

export const usePortfolioStore = create<PortfolioUIState>((set) => ({
  selectedPortfolioId: null,
  isCreateModalOpen: false,
  setSelectedPortfolioId: (id) => set({ selectedPortfolioId: id }),
  openCreateModal: () => set({ isCreateModalOpen: true }),
  closeCreateModal: () => set({ isCreateModalOpen: false }),
}));
