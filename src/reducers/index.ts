// reducers/index.ts
import { combineReducers } from '@reduxjs/toolkit';
import reducerAuth from './authReducer';

const rootReducer = combineReducers({
  user: reducerAuth,
  // Add other reducers here as needed
});

export default rootReducer;
