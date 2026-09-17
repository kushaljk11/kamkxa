import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card';
import { useAuthStore } from '@/store/authStore';
import { toast } from '@/components/ui/Toast';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';

const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters'),
  rememberMe: z.boolean().optional(),
});

export const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoading, authError } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);

  const from = location.state?.from?.pathname || '/my-day';

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  const onSubmit = async (data) => {
    const res = await login(data.email, data.password);
    if (res.success) {
      toast.success('Welcome back!', `Logged in as ${res.user.firstName}`);
      navigate(from, { replace: true });
    } else {
      toast.error('Sign in failed', res.error);
    }
  };

  return (
    <Card className="w-full shadow-card border-border">
      <CardHeader className="text-center pb-2">
        <CardTitle className="text-xl">Welcome back</CardTitle>
        <CardDescription className="text-xs">
          Enter your credentials to access your tasks and projects
        </CardDescription>
      </CardHeader>

      <CardContent>
        {authError && (
          <div className="mb-4 p-2.5 rounded-lg bg-status-dangerBg border border-status-dangerBorder text-status-danger text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{authError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            required
            error={errors.email?.message}
            {...register('email')}
          />

          <div className="relative">
            <Input
              label="Password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              autoComplete="current-password"
              required
              error={errors.password?.message}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="p-1 text-text-muted hover:text-text-primary transition-colors cursor-pointer"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOff className="w-3.5 h-3.5" />
                  ) : (
                    <Eye className="w-3.5 h-3.5" />
                  )}
                </button>
              }
              {...register('password')}
            />
          </div>

          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center gap-2 cursor-pointer text-text-secondary select-none">
              <input
                type="checkbox"
                className="w-3.5 h-3.5 rounded border-border text-primary focus:ring-primary"
                {...register('rememberMe')}
              />
              <span>Remember me</span>
            </label>

            <Link
              to="/forgot-password"
              className="text-primary hover:underline font-medium"
            >
              Forgot password?
            </Link>
          </div>

          <Button
            type="submit"
            variant="primary"
            className="w-full mt-2"
            isLoading={isLoading}
          >
            Sign In
          </Button>

          <Button
            type="button"
            variant="secondary"
            className="w-full text-xs"
            onClick={() => {
              const { setAuth } = useAuthStore.getState();
              setAuth(
                {
                  id: 'demo-user-1',
                  firstName: 'Kushal',
                  lastName: 'Shrestha',
                  email: 'kushal@gotaskmanager.app',
                  timezone: 'Asia/Kathmandu',
                },
                'demo-access-token-jwt'
              );
              toast.success('Signed in as Kushal', 'Quick preview mode active.');
              navigate(from, { replace: true });
            }}
          >
            Demo Preview: Sign in as Kushal
          </Button>
        </form>
      </CardContent>

      <CardFooter className="justify-center text-xs text-text-secondary pt-3">
        <span>Don't have an account?</span>
        <Link
          to="/register"
          className="ml-1.5 text-primary font-semibold hover:underline"
        >
          Create account
        </Link>
      </CardFooter>
    </Card>
  );
};
