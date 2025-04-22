'use client';

import { registerUser } from '@/api';
import { AuthForm } from '@/components/auth/AuthForm';
import { AuthHero } from '@/components/auth/AuthHero';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { AuthLink } from '@/components/auth/AuthLink';
import { FormInput } from '@/components/auth/FormInput';
import { SocialAuth } from '@/components/auth/SocialAuth';
import { ErrorBanner } from '@/components/common/error-banner';
import { LoadingButton } from '@/components/common/loading-button';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import {
  Check,
  Globe,
  Lock,
  Mail,
  MapPin,
  RefreshCw,
  User,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

// Define the form schema with Zod
const signUpSchema = z
  .object({
    firstName: z.string().min(1, { message: 'First name is required' }),
    lastName: z.string().min(1, { message: 'Last name is required' }),
    email: z
      .string()
      .min(1, { message: 'Email is required' })
      .email({ message: 'Please enter a valid email address' }),
    password: z
      .string()
      .min(1, { message: 'Password is required' })
      .min(8, { message: 'Password must be at least 8 characters' })
      .regex(/(?=.*[a-z])/, {
        message: 'Password must contain at least one lowercase letter',
      })
      .regex(/(?=.*[A-Z])/, {
        message: 'Password must contain at least one uppercase letter',
      })
      .regex(/(?=.*\d)/, {
        message: 'Password must contain at least one number',
      })
      .regex(/(?=.*[@$!%*?&])/, {
        message: 'Password must contain at least one special character',
      }),
    confirmPassword: z
      .string()
      .min(1, { message: 'Please confirm your password' }),
    terms: z.boolean().refine((value) => value === true, {
      message: 'You must agree to the Terms of Service and Privacy Policy',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

// Define the form data type from the schema
type SignUpFormValues = z.infer<typeof signUpSchema>;

export default function SignUp() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  // Initialize react-hook-form with zod resolver
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      terms: false,
    },
  });

  const retryRegistration = () => {
    setIsLoading(false);
    setServerError(null);
  };

  const onSubmit = async (data: SignUpFormValues) => {
    setIsLoading(true);
    setServerError(null);

    try {
      // Prepare user data
      const userData = {
        name: `${data.firstName} ${data.lastName}`,
        email: data.email,
        password: data.password,
        confirmPassword: data.confirmPassword,
      };
      const responseData = await registerUser(userData);
      if (responseData.success && responseData.status === 201) {
        setIsSuccess(true);
        toast.success('Registration successful', {
          description: (
            <p className="text-gray-600 dark:text-gray-400">
              Your account has been created. Redirecting to sign in...
            </p>
          ),
          action: {
            label: (
              <div className="flex items-center gap-2">
                <span>Sign In</span>
              </div>
            ),
            onClick: () => router.push('/auth/sign-in'),
          },
          className:
            'bg-white dark:bg-slate-900 border border-green-100 dark:border-green-800 shadow-lg',
          duration: 4000,
        });
        setTimeout(() => {
          router.push('/auth/sign-in');
        }, 2000);
      } else {
        const errorMessage =
          responseData.message || 'Registration failed. Please try again.';
        setServerError(errorMessage);
        toast.error('Registration failed', {
          description: (
            <p className="text-gray-500 dark:text-gray-400">{errorMessage}</p>
          ),
          action: {
            label: (
              <div className="flex items-center gap-2">
                <span>Try again</span>
              </div>
            ),
            onClick: retryRegistration,
          },
          className:
            'bg-white dark:bg-slate-900 border border-red-100 dark:border-red-800 shadow-lg',
        });
      }
    } catch (error) {
      console.error('Error during registration:', error);
      const errorMessage = 'An error occurred. Please try again later.';
      setServerError(errorMessage);
      toast.error('Connection error', {
        description: (
          <p className="text-gray-500 dark:text-gray-400">
            Network error occurred. Please check your connection and try again.
          </p>
        ),
        action: {
          label: (
            <div className="flex items-center gap-2">
              <span>Try again</span>
              <RefreshCw width="16" height="16" />
            </div>
          ),
          onClick: retryRegistration,
        },
        className:
          'bg-white dark:bg-slate-900 border border-red-100 dark:border-red-800 shadow-lg',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const heroFeatures = [
    {
      icon: Globe,
      text: 'Explore destinations and activities tailored to your interests',
      color: 'primary' as const,
    },
    {
      icon: MapPin,
      text: 'Plan and organize your travel adventures with ease',
      color: 'sunset' as const,
    },
    {
      icon: User,
      text: 'Connect with like-minded travelers and share experiences',
      color: 'forest' as const,
    },
  ];

  return (
    <AuthLayout>
      {/* Left Column - Hero Content */}
      <AuthHero
        badge="Join Roamance"
        title={
          <>
            Start Your <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80">
              Travel Journey
            </span>
          </>
        }
        subtitle="Join our community of passionate travelers, create personalized itineraries, and discover hidden gems around the world."
        features={heroFeatures}
      />

      {/* Right Column - Sign Up Form */}
      <AuthForm
        title="Create Account"
        subtitle="Enter your details to join Roamance"
      >
        {isSuccess ? (
          <div className="space-y-4 text-center relative z-10 py-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="mx-auto bg-green-100 dark:bg-green-900/30 p-3 rounded-full w-16 h-16 flex items-center justify-center"
            >
              <Check className="h-8 w-8 text-green-600 dark:text-green-400" />
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-2xl font-bold"
            >
              Registration Successful!
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-muted-foreground"
            >
              Redirecting you to sign in...
            </motion.p>
          </div>
        ) : (
          <>
            <ErrorBanner message={serverError} />

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-5 relative z-10"
            >
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="grid grid-cols-2 gap-4"
              >
                <div className="space-y-2">
                  <label
                    htmlFor="firstName"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    First Name
                  </label>
                  <div className="relative group">
                    <input
                      id="firstName"
                      type="text"
                      placeholder="John"
                      {...register('firstName')}
                      className={`flex h-12 w-full rounded-md border ${
                        errors.firstName
                          ? 'border-destructive'
                          : 'border-input/50'
                      } bg-background/50 py-3 pl-10 pr-4 text-sm ring-offset-background transition-all duration-200 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground/70 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary/50 disabled:cursor-not-allowed disabled:opacity-50 group-hover:border-primary/50`}
                    />
                    <User className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground/80 group-hover:text-primary transition-colors duration-200" />
                  </div>
                  {errors.firstName && (
                    <p className="text-destructive text-xs mt-1">
                      {errors.firstName.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="lastName"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Last Name
                  </label>
                  <div className="relative group">
                    <input
                      id="lastName"
                      type="text"
                      placeholder="Doe"
                      {...register('lastName')}
                      className={`flex h-12 w-full rounded-md border ${
                        errors.lastName
                          ? 'border-destructive'
                          : 'border-input/50'
                      } bg-background/50 py-3 pl-10 pr-4 text-sm ring-offset-background transition-all duration-200 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground/70 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary/50 disabled:cursor-not-allowed disabled:opacity-50 group-hover:border-primary/50`}
                    />
                    <User className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground/80 group-hover:text-primary transition-colors duration-200" />
                  </div>
                  {errors.lastName && (
                    <p className="text-destructive text-xs mt-1">
                      {errors.lastName.message}
                    </p>
                  )}
                </div>
              </motion.div>

              <FormInput
                id="email"
                label="Email"
                type="email"
                placeholder="you@example.com"
                icon={Mail}
                error={errors.email?.message}
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                //@ts-expect-error
                register={register}
                delay={0.6}
              />

              <FormInput
                id="password"
                label="Password"
                type="password"
                placeholder="••••••••"
                icon={Lock}
                error={errors.password?.message}
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                //@ts-expect-error
                register={register}
                delay={0.7}
              />

              <FormInput
                id="confirmPassword"
                label="Confirm Password"
                type="password"
                placeholder="••••••••"
                icon={Lock}
                error={errors.confirmPassword?.message}
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                //@ts-expect-error
                register={register}
                delay={0.8}
              />

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 0.5 }}
                className="flex items-center space-x-3"
              >
                <div className="relative h-5 w-5">
                  <input
                    type="checkbox"
                    id="terms"
                    {...register('terms')}
                    className="peer h-5 w-5 rounded border-muted-foreground/30 text-primary focus:ring-primary/30 focus:ring-offset-0"
                  />
                  <div className="pointer-events-none absolute inset-0 scale-0 rounded-sm border border-primary bg-primary text-primary-foreground opacity-0 transition-transform peer-checked:scale-100 peer-checked:opacity-100">
                    <Check className="h-4 w-4 translate-x-0.5 translate-y-0.5" />
                  </div>
                </div>
                <label
                  htmlFor="terms"
                  className="text-sm text-muted-foreground leading-tight"
                >
                  I agree to the{' '}
                  <Link
                    href="/terms"
                    className="text-primary hover:text-primary/80 transition-colors duration-200"
                  >
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link
                    href="/privacy"
                    className="text-primary hover:text-primary/80 transition-colors duration-200"
                  >
                    Privacy Policy
                  </Link>
                </label>
              </motion.div>
              {errors.terms && (
                <p className="text-destructive text-xs mt-1">
                  {errors.terms.message}
                </p>
              )}

              <LoadingButton
                type="submit"
                isLoading={isLoading}
                loadingText="Creating Account..."
                className="w-full h-12 bg-gradient-to-r from-primary to-primary/90 text-primary-foreground hover:from-primary/90 hover:to-primary/80 transition-all duration-300 shadow-md hover:shadow-lg rounded-md"
              >
                Create Account
              </LoadingButton>
            </form>

            <SocialAuth text="or sign up with" delay={1.1} />

            <AuthLink
              text="Already have an account?"
              linkText="Sign in"
              href="/auth/sign-in"
              delay={1.2}
            />
          </>
        )}
      </AuthForm>
    </AuthLayout>
  );
}
