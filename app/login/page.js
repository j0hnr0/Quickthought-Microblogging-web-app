"use client";

import { useForm } from "react-hook-form";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import LoginForm from "@/components/login-form";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const { status } = useSession();

  // Initialize React Hook Form
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    reset,
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Form submission handler
  const loginMutation = useMutation({
    mutationFn: async (credentials) => {
      const response = await signIn("credentials", {
        email: credentials.email,
        password: credentials.password,
        redirect: false,
      });

      if (response.error) {
        throw new Error("Invalid email or password");
      }

      return response;
    },
    onSuccess: () => {
      reset();
      router.push("/dashboard");
    },
    onError: (error) => {
      setError("email", {
        type: "manual",
        message: "Please check your credentials",
      });

      setError("password", {
        type: "manual",
        message: "Please check your credentials",
      });

      setError("root", {
        type: "manual",
        message: error.message || "An unexpected error occurred",
      });
    },
  });

  const onSubmit = (data) => {
    loginMutation.mutate(data);
  };

  // Redirect if already authenticated
  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard");
    }
  }, [status, router]);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-xl shadow-lg transform transition-all duration-300 hover:shadow-xl">
        <div className="space-y-2">
          <h2 className="text-2xl md:text-3xl font-bold text-center bg-gradient-to-r from-blue-600 to-blue-700 text-transparent bg-clip-text tracking-tight">
            Quickthought
          </h2>
          <h1 className="text-2xl font-semibold text-center text-gray-700 tracking-tight">
            Welcome Back
          </h1>
          <p className="text-sm text-center text-gray-500">
            Share your thoughts with the world
          </p>
        </div>

        <LoginForm
          onSubmit={handleSubmit(onSubmit)}
          errors={errors}
          register={register}
          isSubmitting={isSubmitting || loginMutation.isPending}
        />

        <div className="text-center pt-4">
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <Link
              href="/register"
              className="text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200 inline-flex items-center gap-1 group"
            >
              Register here
              <svg
                className="w-4 h-4 transform transition-transform group-hover:translate-x-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
