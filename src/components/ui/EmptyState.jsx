import Button from './Button.jsx';

// Shown when a list has nothing in it. An empty screen should invite an action,
// never just say "no data".
const EmptyState = ({ title, message, actionLabel, onAction }) => {
  return (
    <div className='py-14 text-center'>
      <h3 className='text-base font-bold'>{title}</h3>
      <p className='mx-auto mt-1.5 max-w-sm text-sm text-muted'>{message}</p>

      {actionLabel && (
        <div className='mt-5'>
          <Button onClick={onAction}>{actionLabel}</Button>
        </div>
      )}
    </div>
  );
};

export default EmptyState;
