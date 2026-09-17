import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card';
import { useAuthStore } from '@/store/authStore';
import { toast } from '@/components/ui/Toast';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';

const registerSchema = z
  .object({
    firstName: z.string().min(1, 'First name is required').max(50),
    lastName: z.string().min(1, 'Last name is required').max(50),
    email: z
      .string()
      .min(1, 'Email is required')
      .email('Please enter a valid email address'),
    password: z
      .string()
      .min(6, 'Password must be at least 6 characters long'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export const RegisterPage = () => {
  const navigate = useNavigate();
  const { register: registerUser, isLoading, authError } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data) => {
    const res = await registerUser({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      password: data.password,
    });

    if (res.success) {
      toast.success('Account created!', `Welcome to GoTaskManager, ${res.user.firstName}!`);
      navigate('/my-day', { replace: true });
    } else {
      toast.error('Registration failed', res.error);
    }
  };

  return (
    <Card className="w-full shadow-card border-border">
      <CardHeader className="text-center pb-2">
        <CardTitle className="text-xl">Create your account</CardTitle>
        <CardDescription className="text-xs">
          Start organizing your tasks, projects, and reminders
        </CardDescription>
      </CardHeader>

      <CardContent>
        {authError && (
          <div className="mb-4 p-2.5 rounded-lg bg-status-dangerBg border border-status-dangerBorder text-status-danger text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{authError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5">
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="First Name"
              placeholder="e.g. Kushal"
              required
              error={errors.firstName?.message}
              {...register('firstName')}
            />
            <Input
              label="Last Name"
              placeholder="e.g. Shrestha"
              required
              error={errors.lastName?.message}
              {...register('lastName')}
            />
          </div>

          <Input
            label="Email Address"
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
              placeholder="At least 6 characters"
              autoComplete="new-password"
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

          <Input
            label="Confirm Password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Re-enter your password"
            autoComplete="new-password"
            required
            error={errors.confirmPassword?.message}
            {...register('confirmPassword')}
          />

          <Button
            type="submit"
            variant="primary"
            className="w-full mt-2"
            isLoading={isLoading}
          >
            Create Account
          </Button>
        </form>
      </CardContent>

      <CardFooter className="justify-center text-xs text-text-secondary pt-3">
        <span>Already have an account?</span>
        <Link
          to="/login"
          className="ml-1.5 text-primary font-semibold hover:underline"
        >
          Log in
        </Link>
      </CardFooter>
    </Card>
  );
};
