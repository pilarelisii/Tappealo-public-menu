import { create } from "zustand";
import type { Venue } from "../types";

type State = {
  venue: Venue | null;
  setVenue: (v: Venue | null) => void;
};

export const useVenueStore = create<State>((set) => ({
  venue: null,
  setVenue: (venue) => set({ venue }),
}));