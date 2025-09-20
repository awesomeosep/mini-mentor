'use client';
import { Container } from '@/components/Landing/Container';
import { Hero } from '@/components/Landing/Hero';
import { SectionTitle } from '@/components/Landing/SectionTitle';
import { Benefits } from '@/components/Landing/Benefits';
import { Faq } from '@/components/Landing/Faq';

import { benefitOne, benefitTwo } from '@/components/Landing/data';
import { Cta } from '@/components/Landing/Cta';
import { Button } from '@/components/ui/button';
import { userAgent } from 'next/server';
export default function Home() {
  return (
    <Container className="flex flex-col gap-16">
      <Hero />
      <SectionTitle preTitle="Benefits" title=" Why should you use this landing page">
        Nextly is a free landing page & marketing website template for startups and indie projects.
        Its built with Next.js & TailwindCSS. And its completely open-source.
      </SectionTitle>

      <Button
        variant="secondary"
        size="lg"
        className="mx-auto w-48"
        onClick={async () => {
          return await fetch('/api/mentor/create', {
            method: 'POST',
            body: JSON.stringify({
              email: 'testuseqwer1234@example.com',
              username: 'testus1wqe234173812',
              name: 'Test 12wqe3123',
            }),
          });
        }}
      >
        Create Mentor User Record
      </Button>

      <Button
        variant="secondary"
        size="lg"
        className="mx-auto w-48"
        onClick={async () => {
          return await fetch('/api/learner/create', {
            method: 'POST',
            body: JSON.stringify({
              email: 'qwertyuiopasdfghjk@example.com',
              username: 'qwertyuiop',
              name: 'asdfhjklxcvbn',
            }),
          });
        }}
      >
        Create Learner User Record
      </Button>

      <Button
        variant="secondary"
        size="lg"
        className="mx-auto w-48"
        onClick={async () => {
          return await fetch('/api/availability/create', {
            method: 'POST',
            body: JSON.stringify({
              userId: '6294c405-fc9e-4792-9698-59b927d8b170',
              day_of_week: 1,
              startTime: '12:20:00',
              endTime: '12:20:00',
              formatNote: 'hello',
            }),
          });
        }}
      >
        Create Availability
      </Button>

      <Button
        variant="secondary"
        size="lg"
        className="mx-auto w-48"
        onClick={async () => {
          return await fetch('/api/match', {
            method: 'POST',
            body: JSON.stringify({
              listing_id: 'af24b61f-074b-40d3-82ea-04ed72e6d350',
              mentor_id: '7f2f117c-ef4e-4442-a333-813ee4eb6902',
              learner_availability: '9cddd9d0-890d-45d4-aafa-8ca2cec812fa',
              mentor_availability: 'df1fa026-a435-4176-a37e-4b6d45d518a9',
            }),
          });
        }}
      >
        Match
      </Button>

      <Button
        variant="secondary"
        size="lg"
        className="mx-auto w-48"
        onClick={async () => {
          return await fetch('/api/match', {
            method: 'UPDATE',
            body: JSON.stringify({
              newStatus: 'PLANNED',
              matchId: 'ea5a6b40-e9d7-4ee3-b43c-ed5368ebe556',
            }),
          });
        }}
      >
        Update Match
      </Button>

      <Button
        variant="secondary"
        size="lg"
        className="mx-auto w-48"
        onClick={async () => {
          return await fetch('/api/match', {
            method: 'GET',
          });
        }}
      >
        Get Matches
      </Button>

      <Benefits data={benefitOne} />
      <Benefits imgPos="right" data={benefitTwo} />

      <SectionTitle preTitle="Watch a video" title="Learn how to fullfil your needs">
        This section is to highlight a promo or demo video of your product. Analysts says a landing
        page with video has 3% more conversion rate. So, don&apos;t forget to add one. Just like
        this.
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
        Answer your customers possible questions here, it will increase the conversion rate as well
        as support or chat requests.
      </SectionTitle>
      <Faq />
    </Container>
  );
}
