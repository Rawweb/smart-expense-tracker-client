import { useState } from 'react';
import toast from 'react-hot-toast';

import { createBudget, updateBudget } from '../api/budgets.js';
import Button from './ui/Button.jsx';
import Input from './ui/Input.jsx';
import Select from './ui/Select.jsx';
import { BUDGET_SCOPES } from '../utils/constants.js';

const toInputDate = (date) => new Date(date).toISOString().split('T')[0];

// First and last day of the current month, as the default period.
const monthStart = () => {
  const d = new Date();
  return toInputDate(new Date(Date.UTC(d.getFullYear(), d.getMonth(), 1)));
};

const monthEnd = () => {
  const d = new Date();
  return toInputDate(new Date(Date.UTC(d.getFullYear(), d.getMonth() + 1, 0)));
};

const BudgetForm = ({ budget, onDone }) => {
  const isEdit = Boolean(budget);

  const [form, setForm] = useState({
    name: budget?.name || '',
    category: budget?.category || BUDGET_SCOPES[0],
    limit: budget?.limit || '',
    startDate: budget ? toInputDate(budget.startDate) : monthStart(),
    endDate: budget ? toInputDate(budget.endDate) : monthEnd(),
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const validate = () => {
    const newErrors = {};

    if (!form.name.trim()) {
      newErrors.name = 'Give this budget a name, e.g. July transport';
    }

    if (!form.limit || Number(form.limit) <= 0) {
      newErrors.limit = 'Enter a limit greater than zero';
    }

    if (new Date(form.endDate) <= new Date(form.startDate)) {
      newErrors.endDate = 'The end date must be after the start date';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);

    try {
      if (isEdit) {
        // The server only accepts name and limit. Changing the dates or the
        // category would corrupt notifiedThresholds, so it ignores them.
        await updateBudget(budget._id, {
          name: form.name,
          limit: Number(form.limit),
        });
        toast.success('Budget updated');
      } else {
        await createBudget({ ...form, limit: Number(form.limit) });
        toast.success('Budget created');
      }

      onDone();
    } catch (error) {
      // The overlap rejection lands here, with the server's own message.
      toast.error(error.response?.data?.message || 'Could not save the budget');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <Input
        label='Name'
        name='name'
        placeholder='July transport'
        value={form.name}
        onChange={handleChange}
        error={errors.name}
      />

      <Select
        label='Category'
        name='category'
        options={BUDGET_SCOPES}
        value={form.category}
        onChange={handleChange}
        // Locked on edit, because the alert history belongs to this category.
        disabled={isEdit}
      />

      <Input
        label='Limit (₦)'
        name='limit'
        type='number'
        placeholder='25000'
        value={form.limit}
        onChange={handleChange}
        error={errors.limit}
      />

      <div className='grid grid-cols-2 gap-3'>
        <Input
          label='Start date'
          name='startDate'
          type='date'
          value={form.startDate}
          onChange={handleChange}
          disabled={isEdit}
        />
        <Input
          label='End date'
          name='endDate'
          type='date'
          value={form.endDate}
          onChange={handleChange}
          error={errors.endDate}
          disabled={isEdit}
        />
      </div>

      {isEdit && (
        <p className='mb-4 -mt-2 text-xs text-muted'>
          The category and dates cannot be changed. This budget has already sent alerts for this
          period. To use a different period, delete it and create a new one.
        </p>
      )}

      <Button type='submit' fullWidth loading={loading}>
        {isEdit ? 'Save changes' : 'Create budget'}
      </Button>
    </form>
  );
};

export default BudgetForm;
