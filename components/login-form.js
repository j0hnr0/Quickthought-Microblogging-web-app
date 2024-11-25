import Button from "@/form-components/button";
import Input from "@/form-components/input";
import Label from "@/form-components/label";

export default function LoginForm({
  onSubmit,
  errors,
  register,
  isSubmitting,
}) {
  return (
    <form onSubmit={onSubmit} className="space-y-6" noValidate>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          error={errors.email}
          id="email"
          type="email"
          placeholder="you@example.com"
          autoComplete="username"
          aria-invalid={!!errors.email}
          registration={register("email", {
            required: "Email is required",
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "Please enter a valid email address",
            },
          })}
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600" role="alert">
            {errors.email.message}
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="password">Password</Label>
        <Input
          error={errors.password}
          id="password"
          type="password"
          placeholder="********"
          autoComplete="current-password"
          aria-invalid={!!errors.password}
          registration={register("password", {
            required: "Password is required",
            minLength: {
              value: 3,
              message: "Password must be at least 3 characters",
            },
          })}
        />
        {errors.password && (
          <p className="mt-1 text-sm text-red-600" role="alert">
            {errors.password.message}
          </p>
        )}
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className={`w-full ${
          isSubmitting
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-black hover:bg-gray-500"
        } text-white p-[10px] mt-[20px] rounded-[8px]`}
      >
        {isSubmitting ? "Logging in..." : "Login"}
      </Button>

      {errors.root && (
        <p className="text-sm text-center text-red-600" role="alert">
          {errors.root.message}
        </p>
      )}
    </form>
  );
}
