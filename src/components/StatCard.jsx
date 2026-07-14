import Card from './ui/Card.jsx';
import { formatNaira } from '../utils/format.js';

const StatCard = ({ label, value, note, color = 'ink' }) => {
  const colors = {
    ink: 'text-ink',
    safe: 'text-safe',
    w80: 'text-w80',
    over: 'text-over',
  };

  return (
    <Card>
      <p className='text-[11px] font-semibold uppercase tracking-wider text-muted'>{label}</p>

      <p className={`mono mt-2 text-2xl font-semibold ${colors[color]}`}>{formatNaira(value)}</p>

      {note && <p className='mt-1 text-xs text-muted'>{note}</p>}
    </Card>
  );
};

export default StatCard;
