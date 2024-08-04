import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  teachers: [],
};

export const teacherSlice = createSlice({
  name: "teachers",
  initialState,
  reducers: {
    setTeachers: (state, action) => {
      state.teachers = action.payload;
    },
    addTeacher: (state, action) => {
      state.teachers.push(action.payload);
    },
    updateTeacher: (state, action) => {
      const index = state.teachers.findIndex(
        teacher => teacher.id === action.payload.id
      );
      if (index !== -1) {
        state.teachers[index] = {
          ...state.teachers[index],
          ...action.payload.data,
        };
      }
    },
    deleteTeacher: (state, action) => {
      state.teachers = state.teachers.filter(
        teacher => teacher.id !== action.payload
      );
    },
  },
});

export const { setTeachers, addTeacher, updateTeacher, deleteTeacher } =
  teacherSlice.actions;
export default teacherSlice.reducer;
