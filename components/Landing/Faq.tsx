'use client';
import React from 'react';
import { Container } from '@/components/Landing/Container';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

export const Faq = () => {
  return (
    <Container className="!p-0">
      <Accordion type="single" collapsible className="mx-auto max-w-3xl">
        {faqdata.map((faq, index) => (
          <AccordionItem key={index} value={faq.question} className="text-lg">
            <AccordionTrigger>{faq.question}</AccordionTrigger>
            <AccordionContent className="text-lg">{faq.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </Container>
  );
};

const faqdata = [
  {
    question: 'Is this application completely free to use?',
    answer: 'Yes! MiniMentor is completely free to use. We do not charge for any features or services.',
  },
  {
    question: 'Is MiniMentor open source?',
    answer: 'Yes, all of our code is freely available on GitHub.',
  },
  {
    question: 'Can I use MiniMentor to earn volunteer hours?',
    answer:
      "It depends on your organization. Some organizations may accept volunteer hours earned through MiniMentor, while others may not. Please check with your organization to see if they accept volunteer hours from MiniMentor.",
  },
  {
    question: 'Is the platform stable? ',
    answer:
      "No, we don't offer tectnical guarantees during our beta period. However, we will do our best to keep the platform up and running as much as possible.",
  },
];
