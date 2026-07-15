import { useState } from 'react';
import toast from 'react-hot-toast';

import { createExpense, updateExpense } from '../api/expenses.js';
import Button from './ui/Button.jsx';
import Input from './ui/Input.jsx';
import Select from './ui/Select.jsx';
import { X } from 'lucide-react';
import { formatNaira } from '../utils/format.js';
import { EXPENSE_CATEGORIES } from '../utils/constants.js';
import { useNotifications } from '../context/NotificationContext.jsx';

// Turns a date into the YYYY-MM-DD that <input type="date"> demands.
// Any other format and the input silently shows blank.
const toInputDate = (date) => new Date(date).toISOString().split('T')[0];

// One form, two jobs. Pass an expense to edit it, pass nothing to create.
const ExpenseForm = ({ expense, onDone }) => {
  const { refetch: refetchNotifications } = useNotifications();
  const isEdit = Boolean(expense);

  const [form, setForm] = useState({
    title: expense?.title || '',
    amount: expense?.amount || '',
    category: expense?.category || EXPENSE_CATEGORIES[0],
    date: expense ? toInputDate(expense.date) : toInputDate(new Date()),
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
      newErrors.title = 'What did you spend on?';
    }

    // An empty input gives "", and Number("") is 0, so this catches both.
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
      // The input gives a string. The schema wants a Number, so convert here.
      const payload = { ...form, amount: Number(form.amount) };

      if (isEdit) {
        await updateExpense(expense._id, payload);
        toast.success('Expense updated');
        onDone();
        return;
      }
      const res = await createExpense(payload);

      toast.success('Expense added');

      // The server told us which thresholds this expense just crossed.
      res.data.alerts?.forEach((alert) => {
        const isOver = alert.threshold === 100;

        toast.custom(
          (t) => (
            <div
              className={`flex w-[340px] items-center gap-3 rounded-lg border-l-4 bg-card px-4 py-3 shadow-lg ${
                isOver ? 'border-l-over' : 'border-l-w80'
              } ${t.visible ? 'animate-in' : 'opacity-0'}`}
            >
              <span
                className={`mono grid h-9 w-9 shrink-0 place-items-center rounded-lg text-xs font-bold ${
                  isOver ? 'bg-over/10 text-over' : 'bg-w80/10 text-w80'
                }`}
              >
                {alert.percentage}%
              </span>

              <div className='min-w-0'>
                <p className='text-sm font-bold'>
                  {isOver
                    ? `${alert.category} budget finished`
                    : `${alert.category} past ${alert.threshold}%`}
                </p>
                <p className='mono mt-0.5 text-xs text-muted'>
                  {formatNaira(alert.spent)} of {formatNaira(alert.limit)}
                </p>
              </div>

              <button
                onClick={() => toast.dismiss(t.id)}
                className='ml-auto shrink-0 text-muted hover:text-ink'
              >
                <X size={14} />
              </button>
            </div>
          ),
          { duration: 6000 },
        );
      });

      if (res.data.alerts?.length > 0) {
        refetchNotifications();
      }

      onDone();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not save the expense');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <Input
        label='What did you spend on?'
        name='title'
        placeholder='Bolt to campus'
        value={form.title}
        onChange={handleChange}
        error={errors.title}
      />

      <Input
        label='Amount (₦)'
        name='amount'
        type='number'
        placeholder='2300'
        value={form.amount}
        onChange={handleChange}
        error={errors.amount}
      />

      <Select
        label='Category'
        name='category'
        options={EXPENSE_CATEGORIES}
        value={form.category}
        onChange={handleChange}
      />

      <Input label='Date' name='date' type='date' value={form.date} onChange={handleChange} />

      <Button type='submit' fullWidth loading={loading} className='mt-2'>
        {isEdit ? 'Save changes' : 'Add expense'}
      </Button>
    </form>
  );
};

export default ExpenseForm;
