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
    <div className='flex flex-wrap items-end gap-4 rounded-xl border border-line bg-card p-4'>
      <div className='flex gap-2'>
        {presets.map((p) => (
          <button
            key={p.label}
            onClick={() => onChange(p.range())}
            className='rounded-full border border-line px-3.5 py-1.5 text-[13px] font-semibold transition hover:border-brand hover:text-brand'
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className='ml-auto flex items-end gap-3'>
        <div>
          <label className='mb-1 block text-[11px] font-semibold text-muted'>From</label>
          <input
            type='date'
            value={range.startDate}
            onChange={(e) => onChange({ ...range, startDate: e.target.value })}
            className='rounded-lg border border-line bg-card px-3 py-2 text-sm outline-none focus:border-brand'
          />
        </div>

        <div>
          <label className='mb-1 block text-[11px] font-semibold text-muted'>To</label>
          <input
            type='date'
            value={range.endDate}
            onChange={(e) => onChange({ ...range, endDate: e.target.value })}
            className='rounded-lg border border-line bg-card px-3 py-2 text-sm outline-none focus:border-brand'
          />
        </div>
      </div>
    </div>
  );
};

export default DateRangePicker;
