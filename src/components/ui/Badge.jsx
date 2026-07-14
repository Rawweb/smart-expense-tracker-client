const Badge = ({ children, color = 'muted' }) => {
  const colors = {
    muted: 'bg-paper text-muted',
    safe: 'bg-safe/10 text-safe',
    w50: 'bg-w50/10 text-w50',
    w80: 'bg-w80/10 text-w80',
    over: 'bg-over/10 text-over',
  };

  return (
    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${colors[color]}`}>
      {children}
    </span>
  );
};

export default Badge;
