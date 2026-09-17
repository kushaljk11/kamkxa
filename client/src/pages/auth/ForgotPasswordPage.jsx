import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card';
import api from '@/services/api';
import { CheckCircle2, ArrowLeft } from 'lucide-react';

const forgotSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
});

export const ForgotPasswordPage = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(forgotSchema),
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      await api.post('/auth/forgot-password', { email: data.email });
      setIsSubmitted(true);
    } catch (err) {
      // Even on failure, show feedback for privacy
      setIsSubmitted(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full shadow-card border-border">
      <CardHeader className="text-center pb-2">
        <CardTitle className="text-xl">Reset your password</CardTitle>
        <CardDescription className="text-xs">
          We'll send you instructions to reset your password
        </CardDescription>
      </CardHeader>

      <CardContent>
        {isSubmitted ? (
          <div className="text-center py-4 space-y-3">
            <div className="w-10 h-10 rounded-full bg-status-successBg text-status-success flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-semibold text-text-primary">Check your inbox</h3>
            <p className="text-xs text-text-secondary leading-relaxed">
              If an account matches that email, we have sent instructions to reset your password.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Email Address"
              type="email"
              placeholder="you@example.com"
              required
              error={errors.email?.message}
              {...register('email')}
            />

            <Button
              type="submit"
              variant="primary"
              className="w-full"
              isLoading={isLoading}
            >
              Send Reset Link
            </Button>
          </form>
        )}
      </CardContent>

      <CardFooter className="justify-center text-xs text-text-secondary pt-3">
        <Link
          to="/login"
          className="inline-flex items-center gap-1.5 text-text-secondary hover:text-text-primary font-medium"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to sign in</span>
        </Link>
      </CardFooter>
    </Card>
  );
};
