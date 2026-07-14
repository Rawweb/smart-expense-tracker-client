import { Link } from 'react-router-dom';

import { getDashboard } from '../api/analytics.js';
import useFetch from '../hooks/useFetch.js';
import Card from '../components/ui/Card.jsx';
import Badge from '../components/ui/Badge.jsx';
import Button from '../components/ui/Button.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';
import StatCard from '../components/StatCard.jsx';
import BudgetRail from '../components/BudgetRail.jsx';
import { StatCardSkeleton, TableSkeleton, ChartSkeleton } from '../components/ui/Skeletons.jsx';
import AlertBanner from '../components/AlertBanner.jsx';
import CategoryDonut from '../components/CategoryDonut.jsx';
import { formatNaira, formatDate, getBudgetColor } from '../utils/format.js';
import { CHART_COLORS } from '../utils/constants.js';

const Dashboard = () => {
  const { data, loading, error } = useFetch(getDashboard);

  if (loading) {
    return (
      <div className='space-y-4'>
        <div className='grid gap-4 md:grid-cols-3'>
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
        </div>
        <ChartSkeleton />
        <TableSkeleton rows={5} />
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <EmptyState
          title='Could not load your dashboard'
          message={error}
          actionLabel='Try again'
          onAction={() => window.location.reload()}
        />
      </Card>
    );
  }

  const { summary, byCategory, budgets, recentExpenses, latestAlert } = data;

  // The overall budget powers the rail. The rest are the category budgets.
  const overall = budgets.find((b) => b.category === 'Overall');

  // Brand new user, nothing recorded yet. Do not show them five empty cards.
  const isEmpty = summary.totalExpenses === 0 && summary.totalIncome === 0;

  if (isEmpty) {
    return (
      <Card>
        <EmptyState
          title='Nothing recorded yet'
          message='Add your first income and expense, set a budget, and we will start watching it for you.'
          actionLabel='Add your first expense'
          onAction={() => (window.location.href = '/transactions')}
        />
      </Card>
    );
  }

  return (
    <div className='space-y-4'>
      {/* The rail sits at the top of the page, under the nav. */}
      {overall && (
        <div className='-mx-6 -mt-7 mb-6'>
          <BudgetRail budget={overall} />
        </div>
      )}

      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-2xl font-extrabold'>Dashboard</h1>
          <p className='mt-0.5 text-sm text-muted'>
            {formatDate(data.startDate)} to {formatDate(data.endDate)}
          </p>
        </div>

        <Link to='/transactions'>
          <Button>Add expense</Button>
        </Link>
      </div>

      {/* Alert banner */}
      {latestAlert && (
        <div className='mb-4'>
          <AlertBanner alert={latestAlert} />
        </div>
      )}

      {/* Requirement 3.5.1 item 6: totals and balance, calculated automatically. */}
      <div className='grid gap-4 md:grid-cols-3'>
        <StatCard
          label='Total income'
          value={summary.totalIncome}
          note={`${summary.incomeCount} ${summary.incomeCount === 1 ? 'entry' : 'entries'} this period`}
          color='safe'
        />
        <StatCard
          label='Total expenses'
          value={summary.totalExpenses}
          note={`${summary.expenseCount} ${summary.expenseCount === 1 ? 'entry' : 'entries'} this period`}
          color='w80'
        />
        <StatCard
          label='Balance'
          value={summary.balance}
          note='Income minus expenses'
          color={summary.balance < 0 ? 'over' : 'ink'}
        />
      </div>

      <div className='grid gap-4 lg:grid-cols-2'>
        {/* Requirement 3.5.1 item 2: what does the user spend most on. */}
        <Card
          title='Spending by category'
          action={
            <Link to='/reports' className='text-xs font-semibold text-muted hover:text-ink'>
              View report
            </Link>
          }
        >
          {byCategory.categories.length === 0 ? (
            <p className='py-8 text-center text-sm text-muted'>No expenses in this period.</p>
          ) : (
            <>
              <div className='flex flex-col items-center gap-6 xl:flex-row'>
                <CategoryDonut
                  categories={byCategory.categories}
                  grandTotal={byCategory.grandTotal}
                />

                {/* Your existing bars, which I am keeping. They earn their place:
            the donut shows the shape, the bars let you read exact figures. */}
                <div className='w-full min-w-0 flex-1 space-y-3'>
                  {byCategory.categories.map((cat, i) => (
                    <div key={cat.category} className='flex items-center gap-3'>
                      <span
                        className='h-2.5 w-2.5 shrink-0 rounded-sm'
                        style={{ backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }}
                      />
                      <span className='w-28 truncate text-sm font-medium'>{cat.category}</span>

                      <div className='h-2 flex-1 rounded-full bg-paper'>
                        <div
                          className='h-2 rounded-full'
                          style={{
                            width: `${cat.percentage}%`,
                            backgroundColor: CHART_COLORS[i % CHART_COLORS.length],
                          }}
                        />
                      </div>

                      <span className='mono w-20 text-right text-sm font-semibold'>
                        {formatNaira(cat.total)}
                      </span>
                      <span className='mono w-9 text-right text-xs text-muted'>
                        {cat.percentage}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <p className='mt-5 border-t border-line pt-3 text-xs text-muted'>
                You spend the most on{' '}
                <span className='font-bold text-ink'>{byCategory.topCategory}</span>, which is{' '}
                {byCategory.categories[0].percentage}% of everything you spent.
              </p>
            </>
          )}
        </Card>

        {/* The category budgets, with their progress bars. */}
        <Card
          title='Budgets'
          action={
            <Link to='/budgets' className='text-xs font-semibold text-muted hover:text-ink'>
              Manage
            </Link>
          }
        >
          {budgets.length === 0 ? (
            <p className='py-8 text-center text-sm text-muted'>
              No active budgets. Set one and we will watch it.
            </p>
          ) : (
            <div className='space-y-4'>
              {budgets.map((b) => {
                const color = getBudgetColor(b.percentage);

                const barColors = {
                  safe: 'bg-safe',
                  w50: 'bg-w50',
                  w80: 'bg-w80',
                  over: 'bg-over',
                };

                const textColors = {
                  safe: 'text-safe',
                  w50: 'text-w50',
                  w80: 'text-w80',
                  over: 'text-over',
                };

                return (
                  <div key={b._id}>
                    <div className='mb-1.5 flex items-baseline justify-between'>
                      <span className='text-sm font-semibold'>{b.category}</span>
                      <span className={`mono text-xs font-bold ${textColors[color]}`}>
                        {b.percentage}%
                      </span>
                    </div>

                    <div className='h-2 rounded-full bg-paper'>
                      <div
                        className={`h-2 rounded-full ${barColors[color]}`}
                        style={{ width: `${Math.min(b.percentage, 100)}%` }}
                      />
                    </div>

                    <div className='mt-1.5 flex justify-between text-xs text-muted'>
                      <span className='mono'>{formatNaira(b.spent)} spent</span>
                      <span className='mono'>of {formatNaira(b.limit)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      </div>

      {/* Requirement 3.5.1 item 10: transaction history. */}
      <Card
        title='Recent expenses'
        action={
          <Link to='/transactions' className='text-xs font-semibold text-muted hover:text-ink'>
            See all
          </Link>
        }
      >
        {recentExpenses.length === 0 ? (
          <p className='py-8 text-center text-sm text-muted'>Nothing recorded yet.</p>
        ) : (
          <div>
            {recentExpenses.map((e) => (
              <div
                key={e._id}
                className='flex items-center gap-4 border-b border-line py-3 last:border-0'
              >
                <span className='flex-1 truncate text-sm font-medium'>{e.title}</span>
                <Badge>{e.category}</Badge>
                <span className='mono w-24 text-right text-xs text-muted'>
                  {formatDate(e.date)}
                </span>
                <span className='mono w-24 text-right text-sm font-semibold'>
                  -{formatNaira(e.amount)}
                </span>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

export default Dashboard;
