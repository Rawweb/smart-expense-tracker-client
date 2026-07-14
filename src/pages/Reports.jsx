import { useState, useEffect, useCallback } from 'react';

import { getSummary, getByCategory, getDaily } from '../api/analytics.js';

import Card from '../components/ui/Card.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';
import StatCard from '../components/StatCard.jsx';
import CategoryDonut from '../components/CategoryDonut.jsx';
import DailyChart from '../components/DailyChart.jsx';
import DateRangePicker from '../components/DateRangePicker.jsx';
import { StatCardSkeleton, ChartSkeleton } from '../components/ui/Skeletons.jsx';

import { formatNaira } from '../utils/format.js';
import { CHART_COLORS } from '../utils/constants.js';

const toInputDate = (date) => new Date(date).toISOString().split('T')[0];

const thisMonth = () => {
  const d = new Date();
  return {
    startDate: toInputDate(new Date(Date.UTC(d.getFullYear(), d.getMonth(), 1))),
    endDate: toInputDate(new Date(Date.UTC(d.getFullYear(), d.getMonth() + 1, 0))),
  };
};

const Reports = () => {
  const [range, setRange] = useState(thisMonth());

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // useCallback keeps this function stable unless the range changes.
  // Without it, a new function every render would retrigger the effect forever.
  const fetchReports = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Three independent requests, so fire them together, not one after another.
      const [summary, byCategory, daily] = await Promise.all([
        getSummary(range),
        getByCategory(range),
        getDaily(range),
      ]);

      setData({
        summary: summary.data,
        byCategory: byCategory.data,
        daily: daily.data,
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Could not load your reports');
    } finally {
      setLoading(false);
    }
  }, [range]);

  // Runs on mount, and again every time the range changes.
  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  return (
    <div className='space-y-4'>
      <div>
        <h1 className='text-2xl font-extrabold'>Reports</h1>
        <p className='mt-0.5 text-sm text-muted'>What the records say about the way you spend</p>
      </div>

      <DateRangePicker range={range} onChange={setRange} />

      {loading ? (
        <div className='space-y-4'>
          <div className='grid gap-4 md:grid-cols-3'>
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
          </div>
          <ChartSkeleton />
        </div>
      ) : error ? (
        <Card>
          <EmptyState title='Could not load your reports' message={error} />
        </Card>
      ) : data.byCategory.grandTotal === 0 ? (
        <Card>
          <EmptyState
            title='Nothing spent in this period'
            message='Try a different date range, or record some expenses first.'
          />
        </Card>
      ) : (
        <>
          <div className='grid gap-4 md:grid-cols-3'>
            <StatCard label='Total income' value={data.summary.totalIncome} color='safe' />
            <StatCard label='Total expenses' value={data.summary.totalExpenses} color='w80' />
            <StatCard
              label='Balance'
              value={data.summary.balance}
              color={data.summary.balance < 0 ? 'over' : 'ink'}
            />
          </div>

          {/* Requirement 3.5.1 item 2: what does the user spend most on. */}
          <Card title='Where your money goes'>
            <div className='flex flex-col items-center gap-8 xl:flex-row'>
              <CategoryDonut
                categories={data.byCategory.categories}
                grandTotal={data.byCategory.grandTotal}
              />

              <div className='w-full min-w-0 flex-1'>
                <table className='w-full'>
                  <thead>
                    <tr className='border-b border-line'>
                      <th className='pb-2.5 text-left text-[10px] font-semibold uppercase tracking-wider text-muted'>
                        Category
                      </th>
                      <th className='pb-2.5 text-right text-[10px] font-semibold uppercase tracking-wider text-muted'>
                        Spent
                      </th>
                      <th className='pb-2.5 text-right text-[10px] font-semibold uppercase tracking-wider text-muted'>
                        Entries
                      </th>
                      <th className='pb-2.5 text-right text-[10px] font-semibold uppercase tracking-wider text-muted'>
                        Share
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {data.byCategory.categories.map((c, i) => (
                      <tr key={c.category} className='border-b border-line last:border-0'>
                        <td className='py-3 text-sm font-medium'>
                          <span className='flex items-center gap-2.5'>
                            <span
                              className='h-2.5 w-2.5 shrink-0 rounded-sm'
                              style={{
                                backgroundColor: CHART_COLORS[i % CHART_COLORS.length],
                              }}
                            />
                            {c.category}
                          </span>
                        </td>
                        <td className='mono py-3 text-right text-sm font-semibold'>
                          {formatNaira(c.total)}
                        </td>
                        <td className='mono py-3 text-right text-xs text-muted'>{c.count}</td>
                        <td className='mono py-3 text-right text-sm'>{c.percentage}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <p className='mt-4 border-t border-line pt-3 text-xs text-muted'>
                  You spend the most on{' '}
                  <span className='font-bold text-ink'>{data.byCategory.topCategory}</span>, which
                  is {data.byCategory.categories[0].percentage}% of everything you spent in this
                  period.
                </p>
              </div>
            </div>
          </Card>

          <div className='grid gap-4 lg:grid-cols-3'>
            <Card title='Daily spending' className='lg:col-span-2'>
              {data.daily.days.length === 0 ? (
                <p className='py-12 text-center text-sm text-muted'>No spending in this period.</p>
              ) : (
                <>
                  <DailyChart days={data.daily.days} dailyAverage={data.daily.dailyAverage} />
                  <p className='mt-3 border-t border-line pt-3 text-xs text-muted'>
                    Orange bars are days you spent more than your own average of{' '}
                    <span className='mono font-semibold text-ink'>
                      {formatNaira(data.daily.dailyAverage)}
                    </span>
                    .
                  </p>
                </>
              )}
            </Card>

            <Card title='Summary'>
              <div className='space-y-3.5'>
                <Row
                  label='Biggest category'
                  sub={data.byCategory.topCategory}
                  value={formatNaira(data.byCategory.categories[0].total)}
                />
                <Row
                  label='Daily average'
                  sub={`Across ${data.daily.activeDays} days you spent`}
                  value={formatNaira(data.daily.dailyAverage)}
                />
                <Row
                  label='Days with spending'
                  sub='Days you recorded something'
                  value={data.daily.activeDays}
                />
                <Row
                  label='Total entries'
                  sub='Expenses recorded'
                  value={data.summary.expenseCount}
                />
              </div>

              <p className='mt-4 border-t border-line pt-3 text-xs leading-relaxed text-muted'>
                The daily average is across the days you actually spent, not every day in the range.
                Dividing by all 31 days would flatter you and hide the pattern.
              </p>
            </Card>
          </div>
        </>
      )}
    </div>
  );
};

// Small local component. It is only used here, so it does not belong in ui/.
const Row = ({ label, sub, value }) => (
  <div className='flex items-center gap-3 border-b border-line pb-3.5 last:border-0 last:pb-0'>
    <div className='min-w-0'>
      <p className='text-sm font-semibold'>{label}</p>
      <p className='mt-0.5 text-xs text-muted'>{sub}</p>
    </div>
    <span className='mono ml-auto shrink-0 text-sm font-bold'>{value}</span>
  </div>
);

export default Reports;
