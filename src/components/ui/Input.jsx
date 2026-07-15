import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const Input = ({ label, error, className = '', type = 'text', ...props }) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';

  return (
    <div className='mb-4'>
      {label && <label className='mb-1.5 block text-xs font-semibold text-muted'>{label}</label>}

      <div className='relative'>
        <input
          type={isPassword && showPassword ? 'text' : type}
          className={`w-full rounded-lg border bg-card px-3.5 py-2.5 text-sm outline-none transition
            ${isPassword ? 'pr-11' : ''}
            ${error ? 'border-over' : 'border-line focus:border-brand'}
            ${className}`}
          {...props}
        />

        {isPassword && (
          <button
            type='button'
            onClick={() => setShowPassword(!showPassword)}
            className='absolute inset-y-0 right-0 grid w-11 place-items-center text-muted hover:text-ink'
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>

      {/* Errors sit under the field they belong to, not in a list at the top. */}
      {error && <p className='mt-1 text-xs text-over'>{error}</p>}
    </div>
  );
};

export default Input;
