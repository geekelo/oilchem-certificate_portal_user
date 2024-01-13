// personnelSlice.js
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

const initialState = {
  students: [],
  certificates: [],
  personnel: [],
  loggedin: 'empty',
  studentsstatus: 'idle',
  certificatesstatus: 'idle',
  personnelstatus: 'idle',
  error: 'no errors yet',
};

export const displayCertificates = createAsyncThunk(
  'user/display_certificates',
  async () => {
    try {
      const response = await fetch('https://oilchem-api-prod.onrender.com/api/v1/certificates', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      throw new Error('Something went wrong with creating the user');
    }
  },
);

export const displayStudents = createAsyncThunk('user/display_students', async () => {
  try {
    const response = await fetch('https://oilchem-api-prod.onrender.com/api/v1/students', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error('Something went wrong with creating the user');
  }
});

export const displayPersonnel = createAsyncThunk(
  'user/display_personnel',
  async () => {
    try {
      const response = await fetch('https://oilchem-api-prod.onrender.com/api/v1/trainingpersonnels', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      throw new Error('Something went wrong with creating the user');
    }
  },
);

const certificatesSlice = createSlice({
  name: 'display_certificates',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(displayCertificates.pending, (state) => ({
        ...state,
        loggedin: 'false',
        certificatesstatus: 'loading',
      }))
      .addCase(displayCertificates.fulfilled, (state, action) => ({
        // Update the state with the received user data
        ...state,
        loggedin: 'true',
        certificates: action.payload,
        certificatesstatus: 'done',
      }))
      .addCase(displayCertificates.rejected, (state, action) => ({
        ...state,
        loggedin: 'false',
        certificatesstatus: 'failed',
        error: action.error.message,
      }))
      // extra reducers for displaystudents
      .addCase(displayStudents.pending, (state) => ({
        ...state,
        loggedin: 'false',
        studentsstatus: 'loading',
      }))
      .addCase(displayStudents.fulfilled, (state, action) => ({
        // Update the state with the received user data
        ...state,
        loggedin: 'true',
        students: action.payload,
        studentsstatus: 'done',
      }))
      .addCase(displayStudents.rejected, (state, action) => ({
        ...state,
        loggedin: 'false',
        studentsstatus: 'failed',
        error: action.error.message,
      }))
      // extra reducers for displaypersonnel
      .addCase(displayPersonnel.pending, (state) => ({
        ...state,
        loggedin: 'false',
        personnelstatus: 'loading',
      }))
      .addCase(displayPersonnel.fulfilled, (state, action) => ({
        // Update the state with the received user data
        ...state,
        loggedin: 'true',
        personnel: action.payload,
        personnelstatus: 'done',
      }))
      .addCase(displayPersonnel.rejected, (state, action) => ({
        ...state,
        loggedin: 'false',
        personnelstatus: 'failed',
        error: action.error.message,
      }));
  },
});

export default certificatesSlice.reducer;
