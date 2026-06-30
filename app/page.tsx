import { Countdown } from "@/components/Countdown";
import { DetailsFaq } from "@/components/DetailsFaq";
import { Hero } from "@/components/Hero";
import { Location } from "@/components/Location";
import { PhotoStory } from "@/components/PhotoStory";
import { Rsvp } from "@/components/Rsvp";
import { Schedule } from "@/components/Schedule";
import { VintageFrame } from "@/components/VintageFrame";
import { weddingContent } from "@/content/wedding";

export default function Home() {
  return (
    <main className="vintage-root">
      <VintageFrame>
        <Hero
          couple={weddingContent.couple}
          event={weddingContent.event}
          navigation={weddingContent.navigation}
        />
        <Countdown target={weddingContent.event.countdownTarget} />
        <PhotoStory photoStory={weddingContent.photoStory} />
        <Schedule
          items={weddingContent.schedule}
          intro={weddingContent.scheduleIntro}
        />
        <Location event={weddingContent.event} />
        <DetailsFaq
          dressCode={weddingContent.dressCode}
          faq={weddingContent.faq}
        />
        <Rsvp
          guestForm={weddingContent.guestForm}
          rsvp={weddingContent.rsvp}
        />
      </VintageFrame>
    </main>
  );
}
