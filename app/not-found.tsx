import TextLink from "@/components/TextLink";

export default function NotFound() {
  return (
    <section className="frame py-32 md:py-48">
      <p className="label">404</p>
      <h1 className="mt-8 text-display-lg">
        This page doesn’t exist — <em className="text-cherry">yet.</em>
      </h1>
      <div className="mt-12">
        <TextLink href="/">Back to the homepage</TextLink>
      </div>
    </section>
  );
}
