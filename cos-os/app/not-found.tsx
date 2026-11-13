import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-screen max-w-xl flex-col justify-center px-5">
      <span className="font-serif text-[3rem] leading-none text-cherry">E.</span>
      <h1 className="mt-6 font-serif text-display-md">Not found.</h1>
      <p className="mt-3 font-serif text-[18px] text-muted-foreground">That record or page doesn&apos;t exist, or it was removed.</p>
      <Link href="/" className="label mt-6 !text-cherry">Back to the Command Centre</Link>
    </main>
  );
}
