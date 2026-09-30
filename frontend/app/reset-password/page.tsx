import { Suspense } from "react";

import ResetPasswordForm from "./components/ResetPasswordForm";

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-slate-50">
          <div className="text-xs font-medium text-slate-500">
            Loading password reset...
          </div>
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}