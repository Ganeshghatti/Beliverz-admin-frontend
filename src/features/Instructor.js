import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  instructor: {
    email: "",
    token: "",
    isInstructor:false,
  },
};

export const instructorSlice = createSlice({
  name: "instructor",
  initialState,
  reducers: {
    saveinstructor: (state, action) => {
      state.instructor = action.payload;
    },
    logout:(state,action)=>{
        state.instructor=initialState
    }
  },
});

export const { saveinstructor,logout } = instructorSlice.actions;

export default instructorSlice.reducer;
