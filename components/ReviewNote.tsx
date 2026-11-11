import { showReviewNotes } from "@/lib/review";

/** Small marker for copy awaiting Emma's approval. Hidden when NEXT_PUBLIC_SHOW_REVIEW_NOTES=false. */
export default function ReviewNote({ children = "Draft — awaiting Emma’s approval", className = "" }: { children?: React.ReactNode; className?: string }) {
  if (!showReviewNotes) return null;
  return (
    <p className={`inline-flex items-center gap-2 border border-dashed border-burgundy/40 px-2.5 py-1 text-[0.6875rem] uppercase tracking-[0.12em] text-burgundy ${className}`}>
      <span aria-hidden="true">●</span>
      {children}
    </p>
  );
}
