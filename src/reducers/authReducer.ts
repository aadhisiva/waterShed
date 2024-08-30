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
  RoleName?:string;
  RoleAccess?:string | any;
  Otp?:string | number;
  RoleId?:string | number;
}

const initialState: ExampleState = {
  data: [],
  isLoggedIn: false,
  sessionEndTime: null,
  token: '',
  Mobile: '',
  Name: '',
  Username: '',
  RoleName: "",
  RoleAccess: {},
  Otp: '',
  RoleId: ''
};

const authSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    userLoggedIn(state, action: PayloadAction<any>) {
      const { RoleAccess, Mobile, Otp, Token, RoleName, RoleId, Username} = action.payload;
      state.isLoggedIn = true;
      state.Mobile = Mobile;
      state.token = Token;
      state.Username = Username,
      state.RoleName = RoleName,
      state.RoleAccess = RoleAccess,
      state.RoleId = RoleId,
      state.Otp = Otp
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
