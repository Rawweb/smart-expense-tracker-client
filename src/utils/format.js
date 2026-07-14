import { format, formatDistanceToNow } from 'date-fns';

export const formatNaira = (amount) => {
  return `₦${Number(amount).toLocaleString('en-NG')}`;
};

export const formatDate = (date) => {
  const d = new Date(date);
  const utc = new Date(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());

  return format(utc, 'd MMM yyyy');
};

// "2 hours ago". Used on the alerts list.
export const formatRelative = (date) => {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
};

export const getBudgetColor = (percentage) => {
  if (percentage >= 100) return 'over';
  if (percentage >= 80) return 'w80';
  if (percentage >= 50) return 'w50';
  return 'safe';
};
