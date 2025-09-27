import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface IGlobalState {
  viewMode: string;
  productQuantities: Record<string, number>;
}

const initialState: IGlobalState = {
  viewMode: "grid",
  productQuantities: {},
};

const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    setViewMode: (s, a: PayloadAction<string>) => {
      s.viewMode = a.payload;
    },

    // payload: { id, qty }
    setProductQuantity: (s, a: PayloadAction<{ id: string; qty: number }>) => {
      const { id, qty } = a.payload;
      s.productQuantities[id] = Math.max(1, qty);
    },

    // helpers
    incrementQty: (s, a: PayloadAction<{ id: string; max?: number }>) => {
      const { id, max = 99 } = a.payload;
      const cur = s.productQuantities[id] ?? 1;
      s.productQuantities[id] = Math.min(max, cur + 1);
    },
    decrementQty: (s, a: PayloadAction<{ id: string }>) => {
      const { id } = a.payload;
      const cur = s.productQuantities[id] ?? 1;
      s.productQuantities[id] = Math.max(1, cur - 1);
    },
    resetQty: (s, a: PayloadAction<{ id: string }>) => {
      delete s.productQuantities[a.payload.id];
    },
  },
});

export const {
  setViewMode,
  setProductQuantity,
  incrementQty,
  decrementQty,
  resetQty,
} = globalSlice.actions;

export default globalSlice.reducer;

// Selector
export const selectProductQty = (
  state: { globals: IGlobalState },
  id: string,
) => state.globals.productQuantities[id] ?? 1;
