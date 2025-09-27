import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ReferralState {
  value: string;
}

const initialState: ReferralState = {
  value: "direct",
};

export const referralSlice = createSlice({
  name: "referral",
  initialState,
  reducers: {
    setReferral: (state, action: PayloadAction<string>) => {
      state.value = action.payload;
    },
  },
});

export const { setReferral } = referralSlice.actions;
export default referralSlice.reducer;
