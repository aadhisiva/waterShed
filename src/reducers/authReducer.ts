// reducers/authReducer.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ExampleState {
  data?: never[]; // Define the type of your state
  isLoggedIn?: boolean; // for user authenticate
  sessionEndTime?: string | any | NodeJS.Timeout | undefined | null | Date; // for user authenticate
  token?: string;
  Mobile?: string;
  Name?: string;
  Username?:string;
}

const initialState: ExampleState = {
  data: [],
  isLoggedIn: false,
  sessionEndTime: null,
  token: '',
  Mobile: '',
  Name: '',
  Username: ''
};

const authSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    userLoggedIn(state, action: PayloadAction<any>) {
      console.log("action",action)
      state.isLoggedIn = true;
      state.Name = action.payload.Name;
      state.Mobile = action.payload.Mobile;
      state.token = action.payload.token;
      state.Username = action.payload.Usernaem
    },
    userLoggedOut(state) {
      state.isLoggedIn = false;
      state.token = '';
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
