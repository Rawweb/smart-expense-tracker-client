import { useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import { Pencil, Trash2 } from 'lucide-react';

import { getExpenses, deleteExpense } from '../api/expenses.js';
import { getIncomes, deleteIncome } from '../api/incomes.js';
import useFetch from '../hooks/useFetch.js';

import Card from '../components/ui/Card.jsx';
import Badge from '../components/ui/Badge.jsx';
import Button from '../components/ui/Button.jsx';
import Modal from '../components/ui/Modal.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';
import { TableSkeleton } from '../components/ui/Skeletons.jsx';
import ExpenseForm from '../components/ExpenseForm.jsx';
import IncomeForm from '../components/IncomeForm.jsx';
import ConfirmDialog from '../components/ConfirmDialog.jsx';

import { formatNaira, formatDate } from '../utils/format.js';

const Transactions = () => {
  const [tab, setTab] = useState('expenses');

  // Which form is open, and what it is editing. null means closed.
  const [editing, setEditing] = useState(null);
  const [formOpen, setFormOpen] = useState(false);

  const [deleting, setDeleting] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const expenses = useFetch(getExpenses);
  const incomes = useFetch(getIncomes);

  const isExpenses = tab === 'expenses';
  const active = isExpenses ? expenses : incomes;

  // useCallback keeps this stable, so passing it to the form does not cause
  // the form to re-render for no reason.
  const handleDone = useCallback(() => {
    setFormOpen(false);
    setEditing(null);

    // Refetch instead of updating local state. One extra request, and the
    // screen can never disagree with the database.
    active.refetch();
  }, [active]);

  const handleDelete = async () => {
    setDeleteLoading(true);

    try {
      if (isExpenses) {
        await deleteExpense(deleting._id);
      } else {
        await deleteIncome(deleting._id);
      }

      toast.success(isExpenses ? 'Expense deleted' : 'Income deleted');
      setDeleting(null);
      active.refetch();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not delete');
    } finally {
      setDeleteLoading(false);
    }
  };

  const openCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const openEdit = (item) => {
    setEditing(item);
    setFormOpen(true);
  };

  const items = isExpenses ? active.data?.expenses : active.data?.incomes;

  return (
    <div className='space-y-4'>
      <div className='flex flex-wrap items-center justify-between gap-3'>
        <div>
          <h1 className='text-2xl font-extrabold'>Income &amp; Expenses</h1>
          <p className='mt-0.5 text-sm text-muted'>
            Every expense recalculates your budgets the moment it is saved
          </p>
        </div>

        <Button onClick={openCreate}>{isExpenses ? 'Add expense' : 'Add income'}</Button>
      </div>

      {/* Tabs. Just two buttons and a piece of state. */}
      <div className='flex gap-1 rounded-lg border border-line bg-card p-1'>
        <button
          onClick={() => setTab('expenses')}
          className={`flex-1 rounded-md px-4 py-2 text-sm font-semibold transition ${
            isExpenses ? 'bg-brand text-white' : 'text-muted hover:bg-paper'
          }`}
        >
          Expenses
        </button>
        <button
          onClick={() => setTab('incomes')}
          className={`flex-1 rounded-md px-4 py-2 text-sm font-semibold transition ${
            !isExpenses ? 'bg-brand text-white' : 'text-muted hover:bg-paper'
          }`}
        >
          Income
        </button>
      </div>

      {active.loading ? (
        <TableSkeleton rows={6} />
      ) : active.error ? (
        <Card>
          <EmptyState title='Could not load' message={active.error} />
        </Card>
      ) : items?.length === 0 ? (
        <Card>
          <EmptyState
            title={isExpenses ? 'No expenses yet' : 'No income yet'}
            message={
              isExpenses
                ? 'Record your first expense and we will start watching your budget.'
                : 'Record what you earn so your balance means something.'
            }
            actionLabel={isExpenses ? 'Add expense' : 'Add income'}
            onAction={openCreate}
          />
        </Card>
      ) : (
        <Card>
          {/* A real table, so screen readers understand the structure. */}
          <div className='overflow-x-auto'>
            <table className='w-full'>
              <thead>
                <tr className='border-b border-line'>
                  <th className='pb-3 text-left text-[10px] font-semibold uppercase tracking-wider text-muted'>
                    Description
                  </th>
                  <th className='pb-3 text-left text-[10px] font-semibold uppercase tracking-wider text-muted'>
                    {isExpenses ? 'Category' : 'Source'}
                  </th>
                  <th className='pb-3 text-left text-[10px] font-semibold uppercase tracking-wider text-muted'>
                    Date
                  </th>
                  <th className='pb-3 text-right text-[10px] font-semibold uppercase tracking-wider text-muted'>
                    Amount
                  </th>
                  <th className='pb-3' />
                </tr>
              </thead>

              <tbody>
                {items?.map((item) => (
                  <tr key={item._id} className='border-b border-line last:border-0'>
                    <td className='py-3.5 text-sm font-medium'>{item.title}</td>

                    <td className='py-3.5'>
                      <Badge>{isExpenses ? item.category : item.source}</Badge>
                    </td>

                    <td className='mono py-3.5 text-xs text-muted'>{formatDate(item.date)}</td>

                    <td
                      className={`mono py-3.5 text-right text-sm font-semibold ${
                        isExpenses ? 'text-ink' : 'text-safe'
                      }`}
                    >
                      {isExpenses ? '-' : '+'}
                      {formatNaira(item.amount)}
                    </td>

                    <td className='py-3.5 pl-4'>
                      <div className='flex justify-end gap-1'>
                        <button
                          onClick={() => openEdit(item)}
                          aria-label='Edit'
                          className='rounded-md p-1.5 text-muted hover:bg-paper hover:text-ink'
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={() => setDeleting(item)}
                          aria-label='Delete'
                          className='rounded-md p-1.5 text-muted hover:bg-paper hover:text-over'
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* The form. The key prop is doing something important, see below. */}
      <Modal
        isOpen={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditing(null);
        }}
        title={
          editing
            ? isExpenses
              ? 'Edit expense'
              : 'Edit income'
            : isExpenses
              ? 'Add expense'
              : 'Add income'
        }
      >
        {isExpenses ? (
          <ExpenseForm key={editing?._id || 'new'} expense={editing} onDone={handleDone} />
        ) : (
          <IncomeForm key={editing?._id || 'new'} income={editing} onDone={handleDone} />
        )}
      </Modal>

      <ConfirmDialog
        isOpen={Boolean(deleting)}
        onClose={() => setDeleting(null)}
        onConfirm={handleDelete}
        loading={deleteLoading}
        title={isExpenses ? 'Delete this expense?' : 'Delete this income?'}
        message={
          deleting
            ? `"${deleting.title}" for ${formatNaira(deleting.amount)} will be removed. Your budget totals will update.`
            : ''
        }
      />
    </div>
  );
};

export default Transactions;
