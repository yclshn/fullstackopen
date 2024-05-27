import { createSlice } from "@reduxjs/toolkit";

const initialState = "";
const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    setNotification(_state, action) {
      return action.payload;
    },
    clearNotification() {
      return initialState;
    },
  },
});
export const { setNotification, clearNotification } = notificationSlice.actions;

export const showNotification = (message, time) => {
  return async (dispatch) => {
    dispatch(setNotification(message));
    setTimeout(() => {
      dispatch(clearNotification());
    }, time * 1000);
  };
};

export default notificationSlice.reducer;
