import { useState } from 'react';
import toast from 'react-hot-toast';

import { getBudgets, deleteBudget } from '../api/budgets.js';
import useFetch from '../hooks/useFetch.js';

import Card from '../components/ui/Card.jsx';
import Button from '../components/ui/Button.jsx';
import Modal from '../components/ui/Modal.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';
import { BudgetCardSkeleton } from '../components/ui/Skeletons.jsx';
import BudgetCard from '../components/BudgetCard.jsx';
import BudgetForm from '../components/BudgetForm.jsx';
import ConfirmDialog from '../components/ConfirmDialog.jsx';

import { formatNaira } from '../utils/format.js';

const Budgets = () => {
  const { data, loading, error, refetch } = useFetch(getBudgets);

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleDone = () => {
    setFormOpen(false);
    setEditing(null);
    refetch();
  };

  const handleDelete = async () => {
    setDeleteLoading(true);

    try {
      await deleteBudget(deleting._id);
      toast.success('Budget deleted');
      setDeleting(null);
      refetch();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not delete the budget');
    } finally {
      setDeleteLoading(false);
    }
  };

  const openCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };

  if (loading) {
    return (
      <div className='space-y-4'>
        <div className='h-8 w-40 animate-pulse rounded-md bg-line' />
        <div className='grid gap-4 md:grid-cols-2'>
          <BudgetCardSkeleton />
          <BudgetCardSkeleton />
          <BudgetCardSkeleton />
          <BudgetCardSkeleton />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <EmptyState title='Could not load your budgets' message={error} />
      </Card>
    );
  }

  const budgets = data.budgets;

  // The overall budget gets its own row. It is the one the whole app watches.
  const overall = budgets.filter((b) => b.category === 'Overall');
  const byCategory = budgets.filter((b) => b.category !== 'Overall');

  return (
    <div className='space-y-4'>
      <div className='flex flex-wrap items-center justify-between gap-3'>
        <div>
          <h1 className='text-2xl font-extrabold'>Budgets</h1>
          <p className='mt-0.5 text-sm text-muted'>
            Set a ceiling you do not want to cross. We alert you at 50%, 80% and 100%.
          </p>
        </div>

        <Button onClick={openCreate}>Create budget</Button>
      </div>

      {budgets.length === 0 ? (
        <Card>
          <EmptyState
            title='No budgets yet'
            message='A budget is what turns this from a record into a warning system. Set one and we will watch it for you.'
            actionLabel='Create your first budget'
            onAction={openCreate}
          />
        </Card>
      ) : (
        <>
          {overall.length > 0 && (
            <div className='space-y-4'>
              <h2 className='text-[11px] font-semibold uppercase tracking-wider text-muted'>
                Overall
              </h2>
              {overall.map((b) => (
                <BudgetCard
                  key={b._id}
                  budget={b}
                  onEdit={(x) => {
                    setEditing(x);
                    setFormOpen(true);
                  }}
                  onDelete={setDeleting}
                />
              ))}
            </div>
          )}

          {byCategory.length > 0 && (
            <div className='space-y-4'>
              <h2 className='text-[11px] font-semibold uppercase tracking-wider text-muted'>
                By category
              </h2>
              <div className='grid gap-4 md:grid-cols-2'>
                {byCategory.map((b) => (
                  <BudgetCard
                    key={b._id}
                    budget={b}
                    onEdit={(x) => {
                      setEditing(x);
                      setFormOpen(true);
                    }}
                    onDelete={setDeleting}
                  />
                ))}
              </div>
            </div>
          )}

          <p className='pt-1 text-xs text-muted'>
            Colour is not decoration here. Green is under 50%, amber means the 50% alert has fired,
            orange means 80%, red means the limit is gone.
          </p>
        </>
      )}

      <Modal
        isOpen={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditing(null);
        }}
        title={editing ? 'Edit budget' : 'Create budget'}
      >
        {/* The key forces a remount, so editing a second budget shows ITS values. */}
        <BudgetForm key={editing?._id || 'new'} budget={editing} onDone={handleDone} />
      </Modal>

      <ConfirmDialog
        isOpen={Boolean(deleting)}
        onClose={() => setDeleting(null)}
        onConfirm={handleDelete}
        loading={deleteLoading}
        title='Delete this budget?'
        message={
          deleting
            ? `"${deleting.name}" will be removed, along with its record of which alerts have already fired. Your expenses are not affected.`
            : ''
        }
      />
    </div>
  );
};

export default Budgets;
