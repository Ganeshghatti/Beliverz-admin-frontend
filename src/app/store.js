import { configureStore } from "@reduxjs/toolkit";
import { adminSlice } from "../features/Admin";
import { loadingSlice } from "../features/Loader";
import { instructorSlice } from "../features/Instructor";

export const store = configureStore({
  reducer: {
    admin: adminSlice.reducer,
    loading:loadingSlice.reducer,
    instructor:instructorSlice.reducer
  },
});
