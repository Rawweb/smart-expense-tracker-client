import { useState } from 'react';
import toast from 'react-hot-toast';

import { createIncome, updateIncome } from '../api/incomes.js';
import Button from './ui/Button.jsx';
import Input from './ui/Input.jsx';
import Select from './ui/Select.jsx';
import { INCOME_SOURCES } from '../utils/constants.js';

const toInputDate = (date) => new Date(date).toISOString().split('T')[0];

const IncomeForm = ({ income, onDone }) => {
  const isEdit = Boolean(income);

  const [form, setForm] = useState({
    title: income?.title || '',
    amount: income?.amount || '',
    source: income?.source || 'Other',
    date: income ? toInputDate(income.date) : toInputDate(new Date()),
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const validate = () => {
    const newErrors = {};

    if (!form.title.trim()) {
      newErrors.title = 'Where did this money come from?';
    }

    if (!form.amount || Number(form.amount) <= 0) {
      newErrors.amount = 'Enter an amount greater than zero';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);

    try {
      const payload = { ...form, amount: Number(form.amount) };

      if (isEdit) {
        await updateIncome(income._id, payload);
        toast.success('Income updated');
      } else {
        await createIncome(payload);
        toast.success('Income added');
      }

      onDone();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not save the income');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <Input
        label='Description'
        name='title'
        placeholder='Allowance from home'
        value={form.title}
        onChange={handleChange}
        error={errors.title}
      />

      <Input
        label='Amount (₦)'
        name='amount'
        type='number'
        placeholder='50000'
        value={form.amount}
        onChange={handleChange}
        error={errors.amount}
      />

      <Select
        label='Source'
        name='source'
        options={INCOME_SOURCES}
        value={form.source}
        onChange={handleChange}
      />

      <Input label='Date' name='date' type='date' value={form.date} onChange={handleChange} />

      <Button type='submit' fullWidth loading={loading} className='mt-2'>
        {isEdit ? 'Save changes' : 'Add income'}
      </Button>
    </form>
  );
};

export default IncomeForm;
