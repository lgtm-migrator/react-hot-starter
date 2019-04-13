import { createSlice, PayloadAction } from 'redux-starter-kit';

export type Count = number;

export type IncrementPayload = void;

export type DecrementPayload = Count;

export type CountPayload = IncrementPayload | DecrementPayload;

const slice = createSlice<Count, PayloadAction<CountPayload>>({
  slice: 'count',
  initialState: 0,
  reducers: {
    increment: count => count + 1,
    decrementBy: (count, { payload }) => count - (payload as Count),
  },
});

export default slice.reducer;

export const {
  actions: { increment, decrementBy },
  selectors: { getCount }, // * unfavorable because of any state type
} = slice;
