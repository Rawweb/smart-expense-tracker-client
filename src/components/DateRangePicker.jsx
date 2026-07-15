import Button from './ui/Button.jsx';

const toInputDate = (date) => new Date(date).toISOString().split('T')[0];

// Three presets that cover almost every question a user actually asks.
const presets = [
  {
    label: 'This month',
    range: () => {
      const d = new Date();
      return {
        startDate: toInputDate(new Date(Date.UTC(d.getFullYear(), d.getMonth(), 1))),
        endDate: toInputDate(new Date(Date.UTC(d.getFullYear(), d.getMonth() + 1, 0))),
      };
    },
  },
  {
    label: 'Last month',
    range: () => {
      const d = new Date();
      return {
        startDate: toInputDate(new Date(Date.UTC(d.getFullYear(), d.getMonth() - 1, 1))),
        endDate: toInputDate(new Date(Date.UTC(d.getFullYear(), d.getMonth(), 0))),
      };
    },
  },
  {
    label: 'This year',
    range: () => {
      const d = new Date();
      return {
        startDate: toInputDate(new Date(Date.UTC(d.getFullYear(), 0, 1))),
        endDate: toInputDate(new Date(Date.UTC(d.getFullYear(), 11, 31))),
      };
    },
  },
];

const DateRangePicker = ({ range, onChange }) => {
  return (
    <div className='flex flex-col gap-4 rounded-xl border border-line bg-card p-4 sm:flex-row sm:flex-wrap sm:items-end'>
      <div className='grid w-full grid-cols-3 gap-2 sm:flex sm:w-auto'>
        {presets.map((p) => {
          const presetRange = p.range();
          const isActive =
            range.startDate === presetRange.startDate && range.endDate === presetRange.endDate;

          return (
            <button
              key={p.label}
              onClick={() => onChange(presetRange)}
              className={`flex min-w-0 items-center justify-center whitespace-nowrap rounded-lg border px-1.5 py-2 text-[11px] font-semibold transition sm:rounded-full sm:px-3.5 sm:py-1.5 sm:text-[13px] ${
                isActive
                  ? 'border-brand bg-brand text-white'
                  : 'border-line text-ink hover:border-brand hover:text-brand'
              }`}
            >
              {p.label}
            </button>
          );
        })}
      </div>

      <div className='grid w-full grid-cols-2 gap-3 sm:ml-auto sm:flex sm:w-auto sm:items-end'>
        <div className='min-w-0'>
          <label className='mb-1 block text-[11px] font-semibold text-muted'>From</label>
          <input
            type='date'
            value={range.startDate}
            onChange={(e) => onChange({ ...range, startDate: e.target.value })}
            className='w-full min-w-0 rounded-lg border border-line bg-card px-2 py-2 text-sm outline-none focus:border-brand sm:w-auto sm:px-3'
          />
        </div>

        <div className='min-w-0'>
          <label className='mb-1 block text-[11px] font-semibold text-muted'>To</label>
          <input
            type='date'
            value={range.endDate}
            onChange={(e) => onChange({ ...range, endDate: e.target.value })}
            className='w-full min-w-0 rounded-lg border border-line bg-card px-2 py-2 text-sm outline-none focus:border-brand sm:w-auto sm:px-3'
          />
        </div>
      </div>
    </div>
  );
};

export default DateRangePicker;
