// reducers/authReducer.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ExampleState {
  data?: never[]; // Define the type of your state
  isLoggedIn?: boolean; // for user authenticate
  sessionEndTime?: string | any | NodeJS.Timeout | undefined | null | Date; // for user authenticate
}

const initialState: ExampleState = {
  data: [],
  isLoggedIn: false,
  sessionEndTime: null,
};

const authSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    userLoggedIn(state) {
      state.isLoggedIn = true;
    },
    userLoggedOut(state) {
      state.isLoggedIn = false;
    },
    setSessionEndTime (state, action: PayloadAction<any>) {
      state.sessionEndTime = action.payload;
    },
    clearSessionEndTime (state) {
      state.sessionEndTime = null;
    },
  },
});
// action: PayloadAction<never[]>
export const { userLoggedIn, userLoggedOut, setSessionEndTime, clearSessionEndTime } = authSlice.actions;
export default authSlice.reducer;
