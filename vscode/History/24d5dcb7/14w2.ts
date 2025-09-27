// global-slice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface IGlobalState {
  viewMode: string;
  language: "bn" | "en";
  productQuantities: Record<string, number>;
}

const initialState: IGlobalState = {
  viewMode: "grid",
  language: "bn",
  productQuantities: {},
};

const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    setViewMode: (s, a: PayloadAction<string>) => {
      s.viewMode = a.payload;
    },
    setLanguage: (s, a: PayloadAction<"en" | "bn">) => {
      s.language = a.payload;
    },

    // payload: { slug, qty }
    setProductQuantity: (
      s,
      a: PayloadAction<{ slug: string; qty: number }>,
    ) => {
      const { slug, qty } = a.payload;
      s.productQuantities[slug] = Math.max(1, qty);
    },

    // helpers
    incrementQty: (s, a: PayloadAction<{ slug: string; max?: number }>) => {
      const { slug, max = 99 } = a.payload;
      const cur = s.productQuantities[slug] ?? 1;
      s.productQuantities[slug] = Math.min(max, cur + 1);
    },
    decrementQty: (s, a: PayloadAction<{ slug: string }>) => {
      const { slug } = a.payload;
      const cur = s.productQuantities[slug] ?? 1;
      s.productQuantities[slug] = Math.max(1, cur - 1);
    },
    resetQty: (s, a: PayloadAction<{ slug: string }>) => {
      delete s.productQuantities[a.payload.slug];
    },
  },
});

export const {
  setViewMode,
  setLanguage,
  setProductQuantity,
  incrementQty,
  decrementQty,
  resetQty,
} = globalSlice.actions;

export default globalSlice.reducer;

// Selector
export const selectProductQty = (
  state: { globals: IGlobalState },
  slug: string,
) => state.globals.productQuantities[slug] ?? 1;
