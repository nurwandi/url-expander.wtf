
import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useIsMobile } from '@/hooks/use-mobile';

const FaqSection: React.FC = () => {
  const isMobile = useIsMobile();
  
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
    <div className="w-full max-w-4xl mx-auto">
      <div className="flex flex-col mb-10 md:mb-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center font-display dark:text-dark-text transition-colors duration-200">
          Frequently Asked <span className="text-pastel-pink dark:text-pink-400 transition-colors duration-200">Why</span> Questions
        </h2>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-1/2">
          <Accordion type="single" collapsible className="w-full">
            {faqItems.map((item, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`} 
                className="border-b border-gray-200 dark:border-gray-700 last:border-b-0 transition-colors duration-200"
              >
                <AccordionTrigger className="py-4 hover:no-underline transition-colors duration-200">
                  <h3 className="text-lg md:text-xl font-bold text-pastel-text dark:text-dark-text mb-0 font-display text-left transition-colors duration-200">
                    {item.question}
                  </h3>
                </AccordionTrigger>
                <AccordionContent className="pb-4">
                  <div className="bg-gray-50 dark:bg-gray-800 p-5 rounded-xl mt-2 transition-colors duration-200">
                    <p className="text-pastel-text dark:text-dark-text text-base transition-colors duration-200">{item.answer}</p>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
        
        <div className="hidden lg:block lg:w-1/2">
          <div className="bg-pastel-blue/10 dark:bg-blue-900/20 p-8 rounded-xl h-full flex items-center justify-center transition-colors duration-200">
            <div className="text-center space-y-4">
              <div className="mb-4">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="64"
                  height="64" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  className="mx-auto text-pastel-blue dark:text-blue-400 transition-colors duration-200"
                >
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
                  <path d="M12 17h.01"/>
                </svg>
              </div>
              <h3 className="text-2xl font-display font-bold text-pastel-text dark:text-dark-text mb-3 transition-colors duration-200">
                Got More Questions?
              </h3>
              <p className="text-pastel-text/80 dark:text-dark-text/80 text-base transition-colors duration-200">
                Click on any question to reveal what we think is a witty answer. The fact that you're reading this means you're already too invested in this ridiculous service.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FaqSection;
