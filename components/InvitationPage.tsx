import { Countdown } from "@/components/Countdown";
import { DetailsFaq } from "@/components/DetailsFaq";
import { Hero } from "@/components/Hero";
import { Location } from "@/components/Location";
import { MotionReveal } from "@/components/MotionReveal";
import { PhotoStory } from "@/components/PhotoStory";
import { Rsvp } from "@/components/Rsvp";
import { RegistryOfficeMap } from "@/components/RegistryOfficeMap";
import { Schedule } from "@/components/Schedule";
import { VintageFrame } from "@/components/VintageFrame";
import type { WeddingContent } from "@/content/wedding";

type InvitationPageProps = {
  content: WeddingContent;
};

export function InvitationPage({ content }: InvitationPageProps) {
  return (
    <main className="vintage-root">
      <MotionReveal />
      <VintageFrame>
        <Hero
          couple={content.couple}
          event={content.event}
          navigation={content.navigation}
        />
        <Countdown
          target={content.event.countdownTarget}
          calendar={content.event.calendar}
        />
        <PhotoStory photoStory={content.photoStory} />
        <Schedule items={content.schedule} intro={content.scheduleIntro} />
        {content.registryOffice ? (
          <RegistryOfficeMap office={content.registryOffice} />
        ) : null}
        <Location event={content.event} />
        <DetailsFaq dressCode={content.dressCode} faq={content.faq} />
        <Rsvp guestForm={content.guestForm} rsvp={content.rsvp} />
      </VintageFrame>
    </main>
  );
}
