import { Container } from '@/components/Landing/Container';
import { Hero } from '@/components/Landing/Hero';
import { SectionTitle } from '@/components/Landing/SectionTitle';
import { Benefits } from '@/components/Landing/Benefits';
import { Faq } from '@/components/Landing/Faq';

import { benefitOne, benefitTwo } from '@/components/Landing/data';
import { Cta } from '@/components/Landing/Cta';
export default function Home() {
  return (
    <Container className="flex flex-col gap-16">
      <Hero />
      <SectionTitle preTitle="Benefits" title=" Why you should choose Mini Mentor?">
        Mini Mentor provides unique advantages for both learners and mentors to create meaningful
        connections and achieve goals.
      </SectionTitle>

      <Benefits data={benefitOne} />
      <Benefits imgPos="right" data={benefitTwo} />

      <SectionTitle preTitle="Watch our demo" title="See how to get started">
        learn how MiniMentor connects learners with expert mentors for personalized growth and skill
        development.
      </SectionTitle>

      <Cta />

      {/* <SectionTitle
        preTitle="Testimonials"
        title="Here's what our customers said"
      >
        Testimonials is a great way to increase the brand trust and awareness.
        Use this section to highlight your popular customers.
      </SectionTitle> */}

      <SectionTitle preTitle="FAQ" title="Frequently Asked Questions">
        Still have questions? We've got answers.
      </SectionTitle>
      <Faq />
    </Container>
  );
}
