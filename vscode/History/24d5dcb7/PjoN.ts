import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface IGlobalState {
  viewMode: string;
  language: "bn" | "en";
  productQuantities: Record<string, number>;
}

// Initial state
const initialState: IGlobalState = {
  viewMode: "grid",
  language: "bn",
  productQuantity: 1,
};

const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    setViewMode: (state, action: PayloadAction<string>) => {
      state.viewMode = action.payload;
    },
    setLanguage: (state, action: PayloadAction<"en" | "bn">) => {
      state.language = action.payload;
    },
    setProductQuantity: (state, action: PayloadAction<number>) => {
      state.productQuantity = action.payload;
    },
  },
});

export const { setViewMode, setLanguage, setProductQuantity } =
  globalSlice.actions;
export default globalSlice.reducer;
