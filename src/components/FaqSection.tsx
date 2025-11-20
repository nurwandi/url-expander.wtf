
import React, { useRef } from 'react';
import { motion, useInView } from 'motion/react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useIsMobile } from '@/hooks/use-mobile';
import { AnimatedTextReveal } from '@/components/ui/animated-text-reveal';

const FaqSection: React.FC = () => {
  const isMobile = useIsMobile();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, margin: "-100px" });

  const faqItems = [
    {
      question: "Why would anyone want longer URLs?",
      answer: "Why does anyone want anything? To stand out. To rebel against convention. To flex on people with URLs that wrap onto 3 lines when they share them. Most importantly, because it's absolutely ridiculous and that makes it beautiful."
    },
    {
      question: "Is this service actually useful?",
      answer: "About as useful as a screen door on a submarine. But sometimes the most beautiful things in life have no practical value. Like art. Or NFTs. Or my computer science degree."
    },
    {
      question: "Why do the URLs expire after 7 days?",
      answer: "Because Cristiano Ronaldo wears number 7. And also I don't want to pay for more database storage. Mostly the CR7 thing though. SIUUUUUUU!"
    },
    {
      question: "Can I use this for important links?",
      answer: "You could, but should you? Would you send someone to a job interview in a clown costume? Actually, don't answer that. Some questions are better left unanswered."
    },
    {
      question: "Did you really build this?",
      answer: "Yes. I spent actual hours of my finite existence on Earth creating a service that makes URLs worse. This is what peak performance looks like."
    }
  ];
  
  return (
    <div ref={ref} className="w-full max-w-5xl mx-auto">
      <motion.div
        className="flex flex-col mb-12 md:mb-16"
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <h2 className="text-display-m md:text-display-l font-black mb-4 text-center tracking-tight text-the-frick-text uppercase">
          <AnimatedTextReveal
            text="Frequently Asked Why Questions"
            triggerOnScroll={true}
            once={false}
            staggerDelay={0.06}
            initialDelay={0.2}
            className="inline"
          />
        </h2>
      </motion.div>

      <div className="flex flex-col lg:flex-row gap-12">
        <div className="lg:w-1/2">
          <Accordion type="single" collapsible className="w-full">
            {faqItems.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{
                  duration: 0.5,
                  delay: isInView ? 0.3 + index * 0.1 : 0,
                  ease: [0.16, 1, 0.3, 1]
                }}
              >
                <AccordionItem
                  value={`item-${index}`}
                  className="border-b-3 border-the-frick-text last:border-b-0"
                  style={{borderBottomWidth: index !== faqItems.length - 1 ? '3px' : '0'}}
                >
                  <AccordionTrigger className="py-5 hover:no-underline">
                    <h3 className="text-lg md:text-xl font-bold text-the-frick-text mb-0 text-left uppercase tracking-wide">
                      {item.question}
                    </h3>
                  </AccordionTrigger>
                  <AccordionContent className="pb-5">
                    <div className="bg-white p-6 border-3 border-the-frick-text mt-2 rounded shadow-[4px_4px_0_0_rgba(26,26,26,0.2)]" style={{borderWidth: '3px'}}>
                      <p className="text-the-frick-text text-base font-medium">{item.answer}</p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        </div>

        <motion.div
          className="hidden lg:block lg:w-1/2"
          initial={{ opacity: 0, x: 20 }}
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
          transition={{ duration: 0.6, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="bg-white p-10 border-4 border-the-frick-text h-full flex items-center justify-center rounded-lg shadow-[8px_8px_0_0_#1A1A1A] relative overflow-hidden">
            {/* Grid pattern overlay */}
            <div className="absolute inset-0 opacity-5 pointer-events-none" style={{
              backgroundImage: `linear-gradient(to right, rgba(26, 26, 26, 0.1) 1px, transparent 1px),
                                linear-gradient(to bottom, rgba(26, 26, 26, 0.1) 1px, transparent 1px)`,
              backgroundSize: '8px 8px'
            }} />

            <div className="text-center space-y-6 relative z-10">
              <div className="mb-4">
                {/* Brutalist question mark shape */}
                <div className="mx-auto w-16 h-16 bg-the-frick-rust border-4 border-the-frick-text flex items-center justify-center text-4xl font-black text-white rotate-6">
                  ?
                </div>
              </div>
              <h3 className="text-2xl font-black text-the-frick-text mb-3 uppercase tracking-tight">
                Got More Questions?
              </h3>
              <p className="text-the-frick-text-muted text-base font-medium">
                Click on any question to reveal what we think is a witty answer. The fact that you're reading this means you're already too invested in this ridiculous service.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default FaqSection;
