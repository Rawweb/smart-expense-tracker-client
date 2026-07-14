import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

import { useAuth } from '../context/AuthContext.jsx';
import Button from '../components/ui/Button.jsx';
import Input from '../components/ui/Input.jsx';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });

    setErrors({ ...errors, [e.target.name]: '' });
  };

  const validate = () => {
    const newErrors = {};
    if (!form.email.trim()) {
      newErrors.email = 'Email is required';
    }

    if (!form.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;
    setLoading(true);

    try {
      await login(form);
      toast.success('Welcome back');

      navigate('/');
    } catch (error) {
      const message = error.response?.data?.message || 'Something went wrong';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='grid min-h-screen lg:grid-cols-2'>
      {/* Left: the pitch. Hidden on small screens. */}
      <div className='hidden flex-col justify-between border-r border-line bg-card p-14 lg:flex'>
        <div className='flex items-center gap-2'>
          <div className='grid h-8 w-8 place-items-center rounded-lg bg-brand text-sm font-extrabold text-white'>
            S
          </div>
          <span className='font-extrabold'>SpendWatch</span>
        </div>

        <div>
          <h1 className='max-w-[15ch] text-4xl font-extrabold leading-tight'>
            Know the moment you cross the line.
          </h1>
          <p className='mt-4 max-w-[38ch] text-sm leading-relaxed text-muted'>
            Set a budget. Record what you spend. Get an alert at 50, 80 and 100 percent, before the
            money is gone.
          </p>

          {/* The threshold rail, the signature element from the mockup. */}
          <div className='relative mt-9 h-2 max-w-sm rounded-full bg-line'>
            <div className='absolute inset-y-0 left-0 w-[52%] rounded-full bg-w50' />
            <div className='absolute -top-1 bottom-[-4px] left-1/2 w-0.5 bg-ink/30' />
            <div className='absolute -top-1 bottom-[-4px] left-[80%] w-0.5 bg-line' />
          </div>
          <div className='mono mt-4 flex gap-6 text-xs text-muted'>
            <span className='text-ink'>50% reached</span>
            <span>80%</span>
            <span>100%</span>
          </div>
        </div>

        <p className='text-xs text-muted'>
          © {new Date().getFullYear()} SpendWatch. Developed by Rawfile.
        </p>
      </div>

      {/* Right: the form. */}
      <div className='grid place-items-center p-8'>
        <div className='w-full max-w-sm'>
          <h1 className='text-2xl font-extrabold'>Welcome back</h1>
          <p className='mt-1 mb-7 text-sm text-muted'>Log in to pick up where you left off.</p>

          {/* A real <form>, so Enter submits and browsers can autofill. */}
          <form onSubmit={handleSubmit} noValidate>
            <Input
              label='Email'
              name='email'
              type='email'
              placeholder='rawfile@gmail.com'
              value={form.email}
              onChange={handleChange}
              error={errors.email}
            />

            <Input
              label='Password'
              name='password'
              type='password'
              placeholder='••••••••'
              value={form.password}
              onChange={handleChange}
              error={errors.password}
            />

            {/* type="submit" is what connects this button to the form's onSubmit. */}
            <Button type='submit' fullWidth loading={loading} className='mt-2'>
              Log in
            </Button>
          </form>

          <p className='mt-5 text-center text-sm text-muted'>
            No account yet?{' '}
            <Link to='/register' className='font-semibold text-brand hover:underline'>
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
