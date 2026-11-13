import { SetPasswordForm } from "./form";

export const dynamic = "force-dynamic";
export const metadata = { title: "Set your password" };

export default function SetPasswordPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-5">
      <span className="font-serif text-[3rem] leading-none text-cherry">E.</span>
      <h1 className="mt-6 font-serif text-[2.4rem] leading-tight">Set your password</h1>
      <p className="mt-2 text-[13px] text-muted-foreground">You&apos;ll use this with your email to sign in to CoS OS.</p>
      <div className="mt-6 border-t-2 border-oxblood pt-6"><SetPasswordForm /></div>
    </main>
  );
}
