import { configureStore } from "@reduxjs/toolkit";
import studentsReducer from "./studentSlice";

const store = configureStore({
  reducer: {
    students: studentsReducer,
  },
});

export default store;
