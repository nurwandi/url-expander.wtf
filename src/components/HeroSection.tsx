
import React from 'react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';

const HeroSection: React.FC = () => {
  const isMobile = useIsMobile();
  return (
    <div className="w-full max-w-4xl mx-auto text-center relative py-12 md:py-[25px] transition-colors duration-200">      
      <div className="relative z-10">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 md:mb-8 font-display tracking-tight leading-tight slide-up dark:text-dark-text transition-colors duration-200">
          <span className="block">
            Making <span className="text-pastel-pink dark:text-pink-400 transition-colors duration-200">URLs</span>
          </span>
          <span className="block">Ridiculously <span className="text-pastel-blue dark:text-blue-400 transition-colors duration-200">Pointless</span></span>
        </h1>
        
        <div className="space-y-5 mb-8 md:mb-12 max-w-2xl mx-auto slide-in-delay-1">
          <p className="text-xl text-pastel-text dark:text-dark-text leading-relaxed md:text-3xl font-semibold transition-colors duration-200">
            I used to dream of becoming Indiana Jones.
          </p>
          
          <p className="text-base md:text-lg text-pastel-text/80 dark:text-dark-text/80 leading-relaxed transition-colors duration-200">
            Now I'm here, celebrating the joy of accomplishment with an app designed to make your URLs 
            <span className="font-medium text-pastel-pink dark:text-pink-400 underline decoration-2 decoration-pastel-pink dark:decoration-pink-400 transition-colors duration-200"> unnecessarily longer</span>, 
            <span className="font-medium text-pastel-blue dark:text-blue-400 underline decoration-2 decoration-pastel-blue dark:decoration-blue-400 transition-colors duration-200"> more complex</span>, and 
            <span className="font-medium dark:text-dark-text underline decoration-2 transition-colors duration-200"> entirely pointless</span>.
          </p>
        </div>
        
        <div className="flex flex-wrap gap-3 justify-center mb-8 md:mb-10 slide-in-delay-2">
          <div className="bg-white dark:bg-dark-surface px-4 py-2 rounded-full border border-pastel-blue dark:border-blue-400 transition-colors duration-200">
            <p className="text-pastel-blue dark:text-blue-400 font-medium text-sm transition-colors duration-200">✨ Completely Unnecessary</p>
          </div>
          <div className="bg-white dark:bg-dark-surface px-4 py-2 rounded-full border border-pastel-pink dark:border-pink-400 transition-colors duration-200">
            <p className="text-pastel-pink dark:text-pink-400 font-medium text-sm transition-colors duration-200">🔥 Ridiculously Complex</p>
          </div>
          <div className="bg-white dark:bg-dark-surface px-4 py-2 rounded-full border border-pastel-mint dark:border-emerald-400 transition-colors duration-200">
            <p className="text-pastel-mint dark:text-emerald-400 font-medium text-sm transition-colors duration-200">🚀 Wonderfully Useless</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
