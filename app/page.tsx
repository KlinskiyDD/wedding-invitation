import { Countdown } from "@/components/Countdown";
import { DressCode } from "@/components/DressCode";
import { Faq } from "@/components/Faq";
import { Hero } from "@/components/Hero";
import { Location } from "@/components/Location";
import { PhotoStory } from "@/components/PhotoStory";
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
      <Countdown target={weddingContent.event.countdownTarget} />
      <Schedule
        items={weddingContent.schedule}
        intro={weddingContent.scheduleIntro}
      />
      <Location event={weddingContent.event} />
      <PhotoStory photoStory={weddingContent.photoStory} />
      <DressCode dressCode={weddingContent.dressCode} />
      <Rsvp rsvp={weddingContent.rsvp} />
      <Faq items={weddingContent.faq} />
    </main>
  );
}
