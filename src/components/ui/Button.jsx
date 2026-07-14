const Button = ({
  children,
  variant = 'primary',
  type = 'button',
  loading = false,
  disabled = false,
  fullWidth = false,
  className = '',
  ...props // onClick, title, and anything else, forwarded to the button
}) => {
  const base =
    'inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50';

  const variants = {
    primary: 'bg-brand text-white hover:bg-brand-hover',
    ghost: 'border border-line bg-card text-ink hover:bg-paper',
    danger: 'bg-over text-white hover:opacity-90',
  };

  return (
    <button
      type={type}
      // A loading button must be unclickable, or a double click sends two expenses.
      disabled={disabled || loading}
      className={`${base} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {loading ? 'Please wait...' : children}
    </button>
  );
};

export default Button;
