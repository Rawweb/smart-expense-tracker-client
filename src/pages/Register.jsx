import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

import { useAuth } from '../context/AuthContext.jsx';
import Button from '../components/ui/Button.jsx';
import Input from '../components/ui/Input.jsx';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const validate = () => {
    const newErrors = {};

    if (!form.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!form.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Must match the server's rule exactly, or the user passes here and fails there.
    if (form.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);

    try {
      await register(form);
      toast.success('Account created');
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
        </div>

        <p className='text-xs text-muted'>
          © {new Date().getFullYear()} SpendWatch. Developed by Rawfile.
        </p>
      </div>

      <div className='grid place-items-center p-8'>
        <div className='w-full max-w-sm'>
          <h1 className='text-2xl font-extrabold'>Create your account</h1>
          <p className='mt-1 mb-7 text-sm text-muted'>
            Takes about a minute. No card, no bank login.
          </p>

          <form onSubmit={handleSubmit} noValidate>
            <Input
              label='Full name'
              name='name'
              placeholder='Kingsley Rawfile'
              value={form.name}
              onChange={handleChange}
              error={errors.name}
            />

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
              placeholder='At least 8 characters'
              value={form.password}
              onChange={handleChange}
              error={errors.password}
            />

            <Button type='submit' fullWidth loading={loading} className='mt-2'>
              Create account
            </Button>
          </form>

          <p className='mt-5 text-center text-sm text-muted'>
            Already registered?{' '}
            <Link to='/login' className='font-semibold text-brand hover:underline'>
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
