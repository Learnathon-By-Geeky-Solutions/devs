'use client';

import { AuthForm } from '@/components/auth/AuthForm';
import { AuthHero } from '@/components/auth/AuthHero';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { AuthLink } from '@/components/auth/AuthLink';
import { FormInput } from '@/components/auth/FormInput';
import { SocialAuth } from '@/components/auth/SocialAuth';
import { ErrorBanner } from '@/components/common/error-banner';
import { LoadingButton } from '@/components/common/loading-button';
import { routes } from '@/constants';
import { authService } from '@/service/auth-service';
import { zodResolver } from '@hookform/resolvers/zod';
import { Lock, Mail, User } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

// Define the form schema with Zod
const signInSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'Email is required' })
    .email({ message: 'Please enter a valid email address' }),
  password: z.string().min(1, { message: 'Password is required' }),
});

// Define the form data type from the schema
type SignInFormValues = z.infer<typeof signInSchema>;

export default function SignIn() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const emailRef = useRef<HTMLInputElement>(null);

  // Initialize react-hook-form with zod resolver
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: SignInFormValues) => {
    setIsLoading(true);
    setError('');

    try {
      await authService.login(data.email, data.password);

      toast.success('Login successful', {
        description: (
          <p className="text-gray-600 dark:text-gray-400">
            Redirecting you to your profile...
          </p>
        ),
        action: {
          label: (
            <div className="flex items-center gap-2">
              <span>Profile</span>
            </div>
          ),
          onClick: () => router.push(routes.profile.href),
        },
        className:
          'bg-white dark:bg-slate-900 border border-green-100 dark:border-green-800 shadow-lg',
        duration: 4000,
      });

      router.push(routes.profile.href);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : 'Network error occurred. Please check your connection and try again.';
      setError(errorMessage);

      toast.error('Login error', {
        description: (
          <p className="text-gray-500 dark:text-gray-400">{errorMessage}</p>
        ),
        action: {
          label: (
            <div className="flex items-center gap-2">
              <span>Create account</span>
            </div>
          ),
          onClick: () => router.push(routes.signUp.href),
        },
        className:
          'bg-white dark:bg-slate-900 border border-red-100 dark:border-red-800 shadow-lg',
        duration: 5000,
      });

      setTimeout(() => {
        router.push(routes.signUp.href);
      }, 3000);
    } finally {
      setIsLoading(false);
    }
  };

  const heroFeatures = [
    {
      icon: User,
      text: 'Access your personalized travel plans and recommendations',
      color: 'primary' as const,
    },
    {
      icon: Mail,
      text: 'Connect with a community of passionate travelers',
      color: 'sunset' as const,
    },
    {
      icon: Lock,
      text: 'Keep your travel memories and experiences secure',
      color: 'forest' as const,
    },
  ];

  return (
    <AuthLayout>
      {/* Left Column - Hero Content */}
      <AuthHero
        badge="Welcome Back"
        title={
          <>
            Sign in to <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80">
              Roamance
            </span>
          </>
        }
        subtitle="Continue your journey, connect with fellow travelers, and discover new destinations around the world."
        features={heroFeatures}
      />

      {/* Right Column - Sign In Form */}
      <AuthForm
        title="Sign In"
        subtitle="Enter your details to access your account"
      >
        <form
          className="space-y-5 relative z-10"
          onSubmit={handleSubmit(onSubmit)}
        >
          <ErrorBanner message={error} />

          <FormInput
            id="email"
            label="Email"
            type="email"
            placeholder="you@example.com"
            icon={Mail}
            delay={0.5}
            error={errors.email?.message}
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-expect-error
            register={register}
            required
            ref={emailRef}
          />

          <FormInput
            id="password"
            label="Password"
            type="password"
            placeholder="••••••••"
            icon={Lock}
            rightElement={
              <Link
                href="/auth/forgot-password"
                className="text-sm font-medium text-primary hover:text-primary/80 transition-colors duration-200"
              >
                Forgot password?
              </Link>
            }
            delay={0.6}
            error={errors.password?.message}
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-expect-error
            register={register}
            required
          />

          <LoadingButton
            type="submit"
            isLoading={isLoading}
            loadingText="Signing In..."
            className="w-full h-12 bg-gradient-to-r from-primary to-primary/90 text-primary-foreground hover:from-primary/90 hover:to-primary/80 transition-all duration-300 shadow-md hover:shadow-lg rounded-md"
          >
            Sign In
          </LoadingButton>
        </form>

        <SocialAuth />

        <AuthLink
          text="Don't have an account?"
          linkText="Sign up"
          href="/auth/sign-up"
        />
      </AuthForm>
    </AuthLayout>
  );
}
