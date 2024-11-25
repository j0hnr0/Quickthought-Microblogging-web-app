import "./globals.css";
import QueryClientProvider from "@/components/query-client-provider";
import { AuthProvider } from "@/components/auth-provider";
import ErrorPage from "@/components/error-page";
import ErrorBoundary from "@/components/error-boundary";

export const metadata = {
  title: "Personal Blog",
  description: "See, Share, Post!",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <QueryClientProvider>
          <AuthProvider>
            <ErrorBoundary fallback={<ErrorPage />}>{children}</ErrorBoundary>
          </AuthProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
