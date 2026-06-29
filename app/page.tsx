import { Faq } from "@/components/Faq";
import { Hero } from "@/components/Hero";
import { Location } from "@/components/Location";
import { Rsvp } from "@/components/Rsvp";
import { Schedule } from "@/components/Schedule";
import { weddingContent } from "@/content/wedding";

export default function Home() {
  return (
    <main>
      <Hero
        couple={weddingContent.couple}
        event={weddingContent.event}
        rsvp={weddingContent.rsvp}
      />
      <Schedule items={weddingContent.schedule} />
      <Location event={weddingContent.event} />
      <Rsvp rsvp={weddingContent.rsvp} />
      <Faq items={weddingContent.faq} />
    </main>
  );
}
