import Skeleton from './Skeleton.jsx';
import Card from './Card.jsx';

// Matches the three stat cards on the dashboard.
export const StatCardSkeleton = () => (
  <Card>
    <Skeleton className='h-3 w-20' />
    <Skeleton className='mt-3 h-7 w-32' />
    <Skeleton className='mt-2 h-3 w-24' />
  </Card>
);

// Matches one row in the transactions table.
export const TableRowSkeleton = () => (
  <div className='flex items-center gap-4 border-b border-line py-3.5'>
    <Skeleton className='h-4 w-40' />
    <Skeleton className='h-5 w-24 rounded-full' />
    <Skeleton className='h-4 w-16' />
    <Skeleton className='ml-auto h-4 w-20' />
  </div>
);

// A table with a heading and however many rows you ask for.
export const TableSkeleton = ({ rows = 5 }) => (
  <Card>
    <Skeleton className='mb-4 h-4 w-32' />
    {/* The array is only here to repeat the row. The index is a safe key
        because this list never reorders and nothing is ever removed from it. */}
    {Array.from({ length: rows }).map((_, i) => (
      <TableRowSkeleton key={i} />
    ))}
  </Card>
);

// Matches a budget card: name, percentage, bar, and the figures underneath.
export const BudgetCardSkeleton = () => (
  <Card>
    <div className='mb-3 flex items-center justify-between'>
      <Skeleton className='h-4 w-28' />
      <Skeleton className='h-4 w-10' />
    </div>
    <Skeleton className='h-2 w-full rounded-full' />
    <div className='mt-3 flex justify-between'>
      <Skeleton className='h-3 w-20' />
      <Skeleton className='h-3 w-20' />
    </div>
  </Card>
);

// The donut plus its category table.
export const ChartSkeleton = () => (
  <Card>
    <Skeleton className='mb-5 h-4 w-40' />
    <div className='flex items-center gap-8'>
      <Skeleton className='h-44 w-44 rounded-full' />
      <div className='flex-1 space-y-3'>
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className='h-4 w-full' />
        ))}
      </div>
    </div>
  </Card>
);

// Full page, used while the auth check runs.
export const PageSkeleton = () => (
  <div className='space-y-4'>
    <Skeleton className='h-8 w-48' />
    <div className='grid grid-cols-3 gap-4'>
      <StatCardSkeleton />
      <StatCardSkeleton />
      <StatCardSkeleton />
    </div>
    <TableSkeleton />
  </div>
);
