import { create } from 'zustand'

type UiState = {
  isAddTaskOpen: boolean
  openAddTask: () => void
  closeAddTask: () => void
}

export const useUiStore = create<UiState>(set => ({
  isAddTaskOpen: false,
  openAddTask: () => set({ isAddTaskOpen: true }),
  closeAddTask: () => set({ isAddTaskOpen: false }),
}))