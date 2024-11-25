import Button from "@/form-components/button";
import Input from "@/form-components/input";
import Label from "@/form-components/label";

export default function RegisterForm({
  onSubmit,
  errors,
  register,
  isSubmitting,
}) {
  return (
    <form onSubmit={onSubmit} className="space-y-6" noValidate>
      <div>
        <Label htmlFor="name">Name</Label>
        <Input
          error={errors.name}
          type="text"
          id="name"
          placeholder="John Doe"
          aria-invalid={!!errors.name}
          registration={register("name", {
            required: "Name is required",
            minLength: {
              value: 2,
              message: "Name must be at least 2 characters",
            },
            pattern: {
              value: /^[A-Za-z ]+$/,
              message: "Name can only contain letters and spaces",
            },
          })}
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600" role="alert">
            {errors.name.message}
          </p>
        )}
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          error={errors.email}
          type="email"
          id="email"
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
          type="password"
          id="password"
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
      <div>
        <Button
          type="submit"
          disabled={isSubmitting}
          className={`w-full ${
            isSubmitting
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-black hover:bg-gray-500"
          } text-white p-[10px] mt-[20px] rounded-[8px]`}
        >
          {isSubmitting ? "Registering..." : "Register"}
        </Button>
      </div>
    </form>
  );
}
