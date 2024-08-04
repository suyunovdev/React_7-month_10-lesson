import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  students: [],
};

export const studentSlice = createSlice({
  name: "students",
  initialState,
  reducers: {
    setStudents: (state, action) => {
      state.students = action.payload;
    },
    addStudent: (state, action) => {
      state.students.push(action.payload);
    },
    updateStudent: (state, action) => {
      const index = state.students.findIndex(
        student => student.id === action.payload.id
      );
      if (index !== -1) {
        state.students[index] = {
          ...state.students[index],
          ...action.payload.data,
        };
      }
    },
    deleteStudent: (state, action) => {
      state.students = state.students.filter(
        student => student.id !== action.payload
      );
    },
  },
});

export const { setStudents, addStudent, updateStudent, deleteStudent } =
  studentSlice.actions;
export default studentSlice.reducer;
