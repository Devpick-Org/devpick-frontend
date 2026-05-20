import { create } from "zustand";

export interface Toast {
  id: string;
  message: string;
  type: "success" | "error" | "info";
}

export interface PlanUpgradeModalState {
  requiredPlan: "PRO" | "MAX";
}

export interface LimitExceededModalState {
  feature: string;
  resetsAt: string | null;
  requiredPlan: "PRO" | "MAX";
}

interface UiStore {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, "id">) => void;
  removeToast: (id: string) => void;
  theme: "light" | "dark";
  toggleTheme: () => void;
  planUpgradeModal: PlanUpgradeModalState | null;
  openPlanUpgradeModal: (requiredPlan: "PRO" | "MAX") => void;
  closePlanUpgradeModal: () => void;
  limitExceededModal: LimitExceededModalState | null;
  openLimitExceededModal: (data: LimitExceededModalState) => void;
  closeLimitExceededModal: () => void;
}

export const useUiStore = create<UiStore>((set, get) => ({
  toasts: [],

  addToast: (toast) =>
    set((state) => ({
      toasts: [
        ...state.toasts,
        { ...toast, id: crypto.randomUUID() },
      ],
    })),

  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),

  theme: "light",

  toggleTheme: () => {
    const next = get().theme === "light" ? "dark" : "light";
    localStorage.setItem("theme", next);
    set({ theme: next });
  },

  planUpgradeModal: null,
  openPlanUpgradeModal: (requiredPlan) => set({ planUpgradeModal: { requiredPlan } }),
  closePlanUpgradeModal: () => set({ planUpgradeModal: null }),

  limitExceededModal: null,
  openLimitExceededModal: (data) => set({ limitExceededModal: data }),
  closeLimitExceededModal: () => set({ limitExceededModal: null }),
}));
