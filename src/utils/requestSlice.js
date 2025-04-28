import { createSlice } from "@reduxjs/toolkit";
import { act } from "react";

const requestSlice = createSlice({
  name: "request",
  initialState: {
    requests: null,
  },
  reducers: {
    addRequests: (state, action) => {
      state.requests = action.payload;
    },
    removeRequests: (state, action) => {
      const currRequest = JSON.parse(JSON.stringify(state.requests));
      const newRequests = currRequest.filter(
        (req) => req?.fromUserId?._id !== action.payload
      );
      state.requests = newRequests;
    },
  },
});

export const { addRequests, removeRequests } = requestSlice.actions;
export default requestSlice.reducer;
