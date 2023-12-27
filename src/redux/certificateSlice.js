// personnelSlice.js
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

const initialState = {
  students: [],
  certificates: [],
  loggedin: 'empty',
  status: 'idle',
  error: 'no errors yet',
};

export const displayCertificates = createAsyncThunk(
  'user/display_certificates',
  async (token) => {
    try {
      const response = await fetch('http://localhost:2000/api/v1/certificates', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
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

export const displayStudents = createAsyncThunk('user/display_students', async (token) => {
  try {
    const response = await fetch('http://localhost:2000/api/v1/students', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
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

const certificatesSlice = createSlice({
  name: 'display_certificates',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(displayCertificates.pending, (state) => ({
        ...state,
        loggedin: 'false',
        status: 'loading',
      }))
      .addCase(displayCertificates.fulfilled, (state, action) => ({
        // Update the state with the received user data
        ...state,
        loggedin: 'true',
        certificates: action.payload,
        status: 'done',
      }))
      .addCase(displayCertificates.rejected, (state, action) => ({
        ...state,
        loggedin: 'false',
        status: 'failed',
        error: action.error.message,
      }))
      // extra reducers for displaybatch
      .addCase(displayStudents.pending, (state) => ({
        ...state,
        loggedin: 'false',
        status: 'loading',
      }))
      .addCase(displayStudents.fulfilled, (state, action) => ({
        // Update the state with the received user data
        ...state,
        loggedin: 'true',
        students: action.payload,
        status: 'done',
      }))
      .addCase(displayStudents.rejected, (state, action) => ({
        ...state,
        loggedin: 'false',
        status: 'failed',
        error: action.error.message,
      }));
  },
});

export default certificatesSlice.reducer;
