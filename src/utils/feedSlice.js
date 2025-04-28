import { createSlice } from "@reduxjs/toolkit";

const feedSlice = createSlice({
  name: "feed",
  initialState: {
    feed: null,
  },
  reducers: {
    addFeed: (state, action) => {
      state.feed = action.payload;
    },

    removeFeed: (state, action) => {
      console.log("Feed Handler called");
      const currFeed = JSON.parse(JSON.stringify(state.feed));
      const newFeed = currFeed?.filter((d) => d._id !== action.payload);
      // console.log("Curr Feed is :", currFeed);
      // console.log("New Feed is :",newFeed);
      state.feed = newFeed;
    },

    // removeFeed: (state, action) => {
    //   console.log("Action Payload is:", action.payload);
    //   const newFeed = state.feed?.data?.filter((d) => d._id !== action.payload);
    //   console.log("New Feed is:", newFeed);
    //   // Ensure the structure of state.feed remains consistent
    //   state.feed = { ...state.feed, data: newFeed };
    // },
  },
});

export const { addFeed, removeFeed } = feedSlice.actions;
export default feedSlice.reducer;
