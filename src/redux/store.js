import { configureStore } from "@reduxjs/toolkit";
import studentsReducer from "./studentSlice";
import teacherReducer from "./teacherSlice";

const store = configureStore({
  reducer: {
    students: studentsReducer,
    teachers: teacherReducer,
  },
});

export default store;
