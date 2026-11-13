export default function Loading() {
  return (
    <div role="status" aria-live="polite" className="animate-fade-in">
      <div className="mb-8 border-b border-oxblood pb-6">
        <div className="h-3 w-8 bg-linen-deep" />
        <div className="mt-3 h-12 w-2/3 max-w-xl bg-linen" />
        <div className="mt-3 h-4 w-1/2 max-w-md bg-linen" />
      </div>
      <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-24 border-t-2 border-linen-deep bg-linen/60" />)}
      </div>
      <span className="sr-only">Loading</span>
    </div>
  );
}
