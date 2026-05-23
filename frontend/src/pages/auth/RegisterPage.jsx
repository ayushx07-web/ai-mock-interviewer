// src/pages/auth/RegisterPage.jsx
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { Mic } from 'lucide-react';
import { toast } from 'react-toastify';
import { useRegisterMutation, useLoginMutation } from '../../store/api/authApi';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../../store/slices/authSlice';
import { useAuth } from '../../hooks/useAuth';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { ROLES } from '../../utils/constants';

const registerSchema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Please enter a valid email address'),
    college: z.string().optional(),
    targetRole: z.string().min(1, 'Please select a target role'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export default function RegisterPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated } = useAuth();
  const [registerMutation, { isLoading: isRegistering }] = useRegisterMutation();
  const [loginMutation, { isLoading: isLoggingIn }] = useLoginMutation();

  const isLoading = isRegistering || isLoggingIn;

  useEffect(() => {
    if (isAuthenticated) navigate('/dashboard', { replace: true });
  }, [isAuthenticated, navigate]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data) => {
    try {
      const { confirmPassword, ...payload } = data;
      await registerMutation(payload).unwrap();

      // Auto-login after registration
      const loginResult = await loginMutation({
        email: data.email,
        password: data.password,
      }).unwrap();

      const { token, ...user } = loginResult.data;
      dispatch(setCredentials({ user, token }));
      toast.success('Account created! Welcome aboard.');
      navigate('/dashboard', { replace: true });
    } catch (err) {
      const message = err?.data?.message || 'Registration failed. Please try again.';
      toast.error(message);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 rounded bg-primary/20 flex items-center justify-center">
            <Mic className="w-4 h-4 text-primary" />
          </div>
          <span className="text-sm font-semibold text-foreground">MockInterview AI</span>
        </div>

        <h1 className="text-2xl font-semibold text-foreground mb-1">Create account</h1>
        <p className="text-sm text-muted-foreground mb-6">
          Start practicing interviews with AI feedback
        </p>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
          {/* Name */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="name" className="text-sm font-medium text-foreground">
              Full name
            </label>
            <input
              id="name"
              type="text"
              autoComplete="name"
              placeholder="Jane Smith"
              className="input-base"
              {...register('name')}
            />
            {errors.name && (
              <p className="text-xs text-destructive">{errors.name.message}</p>
            )}
          </div>

          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-sm font-medium text-foreground">
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              className="input-base"
              {...register('email')}
            />
            {errors.email && (
              <p className="text-xs text-destructive">{errors.email.message}</p>
            )}
          </div>

          {/* College */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="college" className="text-sm font-medium text-foreground">
              College / University{' '}
              <span className="text-muted text-xs font-normal">(optional)</span>
            </label>
            <input
              id="college"
              type="text"
              placeholder="IIT Bombay"
              className="input-base"
              {...register('college')}
            />
          </div>

          {/* Target Role */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="targetRole" className="text-sm font-medium text-foreground">
              Target role
            </label>
            <select
              id="targetRole"
              className="input-base"
              {...register('targetRole')}
            >
              <option value="">Select a role…</option>
              {ROLES.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
            {errors.targetRole && (
              <p className="text-xs text-destructive">{errors.targetRole.message}</p>
            )}
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="password" className="text-sm font-medium text-foreground">
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="new-password"
              placeholder="At least 6 characters"
              className="input-base"
              {...register('password')}
            />
            {errors.password && (
              <p className="text-xs text-destructive">{errors.password.message}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="confirmPassword" className="text-sm font-medium text-foreground">
              Confirm password
            </label>
            <input
              id="confirmPassword"
              type="password"
              autoComplete="new-password"
              placeholder="Repeat your password"
              className="input-base"
              {...register('confirmPassword')}
            />
            {errors.confirmPassword && (
              <p className="text-xs text-destructive">{errors.confirmPassword.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary w-full mt-1"
          >
            {isLoading ? <LoadingSpinner size="sm" /> : null}
            {isLoading ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        <p className="text-sm text-muted-foreground mt-5 text-center">
          Already have an account?{' '}
          <Link to="/login" className="text-primary hover:text-primary-hover transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
