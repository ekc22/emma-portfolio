import type { Metadata } from "next";
import CurrentlyList from "@/components/CurrentlyList";
import ReviewNote from "@/components/ReviewNote";
import { currently } from "@/content/profile";
import { showReviewNotes } from "@/lib/review";

export const metadata: Metadata = {
  title: "Currently",
  description: "Ideas, interests and experiments Emma Clark is exploring right now.",
  alternates: { canonical: "/currently/" },
};

export default function CurrentlyPage() {
  // Unfilled "TODO" picks only show while review notes are on.
  const notebook = currently.notebook
    .map((g) => ({ ...g, items: showReviewNotes ? g.items : g.items.filter((it) => !it.startsWith("TODO")) }))
    .filter((g) => g.items.length > 0);

  return (
    <>
      <section className="frame pb-16 pt-12 md:pb-24 md:pt-20">
        <div className="grid-12">
          <div className="col-span-4 flex justify-between md:col-span-12">
            <p className="label">Currently</p>
            <p className="label">Updated {currently.updated}</p>
          </div>
          <h1 className="col-span-4 mt-8 text-display-xl md:col-span-11 md:mt-12 motion-safe:animate-page-in">
            A few things <em className="text-cherry">on my mind.</em>
          </h1>
          <p className="col-span-4 mt-10 max-w-measure text-lg text-muted-ink md:col-span-5 md:col-start-7 md:mt-16">
            A running note of ideas, interests and experiments: what I’m exploring, reading and trying out. It changes often.
          </p>
        </div>
      </section>

      <section aria-label="Current focus" className="frame pb-20 md:pb-28">
        <CurrentlyList entries={currently.entries} large />
      </section>

      <section aria-labelledby="notebook-title" className="frame pb-24 md:pb-36">
        <div className="grid-12">
          <div className="col-span-4 border-t border-linen-deep pt-4 md:col-span-12">
            <h2 id="notebook-title" className="label">From the notebook</h2>
          </div>
          <div className="col-span-4 mt-6 md:col-span-12">
            <ReviewNote>Placeholder picks: Emma to replace</ReviewNote>
          </div>
          {notebook.map((group, i) => (
            <div key={group.label} className={`col-span-4 mt-10 md:col-span-3 ${i === 0 ? "md:col-start-1" : ""} ${i === 1 ? "md:col-start-5" : ""} ${i === 2 ? "md:col-start-9" : ""}`}>
              <h3 className="font-serif text-2xl italic text-cherry">{group.label}</h3>
              <ul className="mt-4 space-y-2">
                {group.items.map((it) => (
                  <li key={it} className="border-b border-linen-deep pb-2">{it}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
