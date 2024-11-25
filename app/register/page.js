"use client";

import RegisterForm from "@/components/register-form";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

export default function RegisterPage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    reset,
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (credentials) => {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Registration failed");
      }

      return data;
    },
    onSuccess: () => {
      reset(); // Reset form after successful registration
      router.push("/login");
    },
    onError: (error) => {
      if (error.message === "User already exists") {
        setError("email", {
          type: "manual",
          message: error.message,
        });
      } else {
        setError("root", {
          type: "manual",
          message: error.message || "An unexpected error occurred",
        });
      }
    },
  });

  const onSubmit = (data) => {
    registerMutation.mutate(data);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-xl shadow-lg transform transition-all duration-300 hover:shadow-xl">
        <div className="space-y-2">
          <h2 className="text-2xl md:text-3xl font-bold text-center bg-gradient-to-r from-blue-600 to-blue-700 text-transparent bg-clip-text tracking-tight">
            Quickthought
          </h2>
          <h1 className="text-2xl font-semibold text-center text-gray-700 tracking-tight">
            Create Account
          </h1>
          <p className="text-sm text-center text-gray-500">
            Join our community and start sharing your thoughts
          </p>
        </div>

        <RegisterForm
          onSubmit={handleSubmit(onSubmit)}
          errors={errors}
          register={register}
          isSubmitting={isSubmitting || registerMutation.isPending}
        />

        {errors.root && (
          <div className="p-3 bg-red-50 border border-red-100 rounded-lg flex items-center gap-2">
            <svg
              className="h-5 w-5 text-red-600 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-1-7v2h2v-2h-2zm0-8v6h2V7h-2z" />
            </svg>
            <p className="text-sm font-medium text-red-600">
              {errors.root.message}
            </p>
          </div>
        )}

        <div className="text-center pt-4">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200 inline-flex items-center gap-1 group"
            >
              Login here
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
