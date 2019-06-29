import { Divider, FormControl, TextField } from '@material-ui/core';
import { Form, Formik } from 'formik';
import React, { FC, memo } from 'react';
import { number, object } from 'yup';
import Button from '../../components/Button';
import { CountState, CreateDecrementBy } from '../../store/slices/count';

export interface Values {
  amount: CountState['value'];
}

const initialValues: Values = {
  amount: 1,
};

export const schema = object().shape({
  amount: number()
    .min(-5)
    .max(5)
    .required(),
});

export interface DecrementProps {
  decrementBy: CreateDecrementBy;
  isLoading: CountState['isLoading'];
}

const Decrement: FC<DecrementProps> = ({ decrementBy, isLoading }) => (
  <Formik
    initialValues={initialValues}
    onSubmit={values => {
      const { amount } = values;

      decrementBy(amount);
    }}
    validationSchema={schema}
  >
    {({ values, errors, handleChange, handleBlur }) => (
      <Form>
        <FormControl>
          <TextField
            name="amount"
            label="Decrement By Amount"
            variant="outlined"
            type="number"
            value={values.amount}
            onChange={handleChange}
            onBlur={handleBlur}
            error={Boolean(errors.amount)}
            helperText={errors.amount}
          />
        </FormControl>
        <br />
        <br />
        <Divider />
        <br />
        <Button
          color="secondary"
          variant="contained"
          type="submit"
          isLoading={isLoading}
        >
          Decrement
        </Button>
      </Form>
    )}
  </Formik>
);

export default memo(Decrement, () => true);
