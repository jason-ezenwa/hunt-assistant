import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { authClient } from '@/lib/auth/auth-client';
import { signUpSchema, type SignUpFormData } from '@/lib/validations/auth.schemas';
import AuthLayout from '@/components/layouts/auth-layout';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function SignUp() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  const handleGoogleSignUp = async () => {
    try {
      const { error } = await authClient.signIn.social({
        provider: 'google',
        callbackURL: '/dashboard',
      });

      if (error) {
        console.error('Google sign-up error:', error);
        toast.error('Google sign-up failed');
      }
    } catch (error) {
      console.error('Google sign-up error:', error);
      toast.error('An unexpected error occurred');
    }
  };

  const onSubmit = async (data: SignUpFormData) => {
    setIsLoading(true);
    try {
      const { error } = await authClient.signUp.email({
        email: data.email,
        password: data.password,
        name: data.name,
      });

      if (error) {
        console.error('Signup error:', error);
        toast.error(error.message || 'Signup failed');
      } else {
        toast.success('Signup successful');
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('Signup error:', error);
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="mb-4 md:mb-6">
        <h1 className="text-xl md:text-2xl font-semibold text-center text-foreground">
          Create an account
        </h1>
        <p className="text-sm text-muted-foreground text-center mt-2">
          Get started with your job hunting assistant
        </p>
      </div>

      <Button
        type="button"
        onClick={handleGoogleSignUp}
        variant="outline"
        className="w-full mb-4 md:mb-6 bg-white border-[#d9d9d9] text-[#0000008f] font-normal py-2 md:py-3 px-3 md:px-4 h-auto rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-[#002ed4] focus:ring-offset-2 text-sm md:text-base flex items-center justify-center gap-2 md:gap-3">
        <svg className="w-4 h-4 md:w-5 md:h-5" viewBox="0 0 24 24">
          <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        Continue with Google
      </Button>

      <div className="flex items-center mb-4 md:mb-6">
        <div className="flex-1 h-px bg-[#f0f0f0]"></div>
        <span className="px-2 md:px-3 text-[#808080] text-xs md:text-sm font-normal">OR</span>
        <div className="flex-1 h-px bg-[#f0f0f0]"></div>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-[#33393c] mb-2">
            Full Name
          </label>
          <input
            type="text"
            placeholder="John Doe"
            className="w-full h-10 px-3 py-2 border border-[#d9d9d9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#002ed4] focus:border-transparent text-sm placeholder:text-[#808080] touch-manipulation"
            {...form.register('name')}
          />
          {form.formState.errors.name && (
            <p className="mt-1 text-sm text-red-600">{form.formState.errors.name.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-[#33393c] mb-2">
            Email
          </label>
          <input
            type="email"
            placeholder="john@example.com"
            className="w-full h-10 px-3 py-2 border border-[#d9d9d9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#002ed4] focus:border-transparent text-sm placeholder:text-[#808080] touch-manipulation"
            {...form.register('email')}
          />
          {form.formState.errors.email && (
            <p className="mt-1 text-sm text-red-600">{form.formState.errors.email.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-[#33393c] mb-2">
            Password
          </label>
          <input
            type="password"
            placeholder="••••••••"
            className="w-full h-10 px-3 py-2 border border-[#d9d9d9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#002ed4] focus:border-transparent text-sm placeholder:text-[#808080] touch-manipulation"
            {...form.register('password')}
          />
          {form.formState.errors.password && (
            <p className="mt-1 text-sm text-red-600">{form.formState.errors.password.message}</p>
          )}
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full bg-[#002ed4] text-white font-medium py-2 px-4 rounded-lg hover:bg-[#0020b8] transition-colors focus:outline-none focus:ring-2 focus:ring-[#1890ff] focus:ring-offset-2 h-auto text-sm">
          {isLoading ? "Creating account..." : "Sign up"}
        </Button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link
            href="/auth/sign-in"
            className="text-[#002ed4] hover:text-[#0020b8] transition-colors font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
