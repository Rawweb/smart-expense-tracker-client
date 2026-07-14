import { useState } from 'react';
import toast from 'react-hot-toast';

import Button from '../components/ui/Button.jsx';
import Input from '../components/ui/Input.jsx';
import Select from '../components/ui/Select.jsx';
import Card from '../components/ui/Card.jsx';
import Badge from '../components/ui/Badge.jsx';
import Modal from '../components/ui/Modal.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';
import {
  StatCardSkeleton,
  TableSkeleton,
  BudgetCardSkeleton,
} from '../components/ui/Skeletons.jsx';

import { EXPENSE_CATEGORIES } from '../utils/constants.js';
import { formatNaira, getBudgetColor } from '../utils/format.js';

const Dashboard = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fakes a slow request, so you can watch the skeleton do its job.
  const fakeLoad = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  };

  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between'>
        <h1 className='text-2xl font-extrabold'>Component test</h1>
        <Button variant='ghost' onClick={fakeLoad}>
          Show skeletons
        </Button>
      </div>

      {loading ? (
        <>
          <div className='grid grid-cols-3 gap-4'>
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
          </div>
          <div className='grid grid-cols-2 gap-4'>
            <BudgetCardSkeleton />
            <BudgetCardSkeleton />
          </div>
          <TableSkeleton rows={4} />
        </>
      ) : (
        <>
          <Card title='Buttons'>
            <div className='flex gap-3'>
              <Button onClick={() => toast.success('It works')}>Primary</Button>
              <Button variant='ghost'>Ghost</Button>
              <Button variant='danger'>Danger</Button>
              <Button loading>Loading</Button>
            </div>
          </Card>

          <Card title='Fields'>
            <Input label='Title' placeholder='Bolt to campus' />
            <Input label='Amount' error='Amount must be greater than zero' defaultValue='-500' />
            <Select label='Category' options={EXPENSE_CATEGORIES} />
          </Card>

          <Card title='Money and colour'>
            <p className='mono text-2xl font-semibold'>{formatNaira(16300)}</p>
            <div className='mt-3 flex gap-2'>
              <Badge color={getBudgetColor(23)}>23%</Badge>
              <Badge color={getBudgetColor(54)}>54%</Badge>
              <Badge color={getBudgetColor(83)}>83%</Badge>
              <Badge color={getBudgetColor(125)}>125%</Badge>
            </div>
          </Card>

          <Card>
            <EmptyState
              title='No expenses yet'
              message='Record your first expense and we will start watching your budget.'
              actionLabel='Add expense'
              onAction={() => setOpen(true)}
            />
          </Card>
        </>
      )}

      <Modal isOpen={open} onClose={() => setOpen(false)} title='Add expense'>
        <Input label='Title' placeholder='Bolt to campus' />
        <Input label='Amount' type='number' placeholder='2300' />
        <Select label='Category' options={EXPENSE_CATEGORIES} />
        <Button fullWidth onClick={() => setOpen(false)}>
          Save expense
        </Button>
      </Modal>
    </div>
  );
};

export default Dashboard;
