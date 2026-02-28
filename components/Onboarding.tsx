import { useState } from 'react';
import { Coins, Store, Banknote, ChevronRight } from 'lucide-react';
import { ZoldLogo } from '@/components/ZoldLogo';

interface OnboardingProps {
  onComplete: () => void;
}

const slides = [
  {
    icon: Coins,
    title: 'Save in digital gold from ₹100',
    description: 'Buy and sell 24K pure gold at live market rates anytime',
  },
  {
    icon: Store,
    title: 'Convert to jewellery at nearby jeweller',
    description: 'Use your digital gold at our partner stores across India',
  },
  {
    icon: Banknote,
    title: 'Loans & delivery made easy',
    description: 'Get instant loans on your gold or take physical delivery',
  },
];

export function Onboarding({ onComplete }: OnboardingProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      onComplete();
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  return (
    <div className="h-screen bg-gradient-to-br from-[#3D3066] via-[#5C4E7F] to-[#8B7FA8] flex flex-col overflow-hidden">
      {/* Skip Button */}
      <div className="p-4 text-right flex-shrink-0">
        <button
          onClick={handleSkip}
          className="text-white/90 px-4 py-2 rounded-lg hover:bg-gray-50/10 transition-colors"
        >
          Skip
        </button>
      </div>

      {/* Content - Made flexible to fit within viewport */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-4 min-h-0">
        <div className="bg-gray-50/20 backdrop-blur-sm rounded-full p-6 mb-6 sm:p-8 sm:mb-8">
          {(() => {
            const IconComponent = slides[currentSlide].icon;
            return <IconComponent className="w-16 h-16 sm:w-20 sm:h-20 text-white" strokeWidth={1.5} />;
          })()}
        </div>

        <h2 className="text-white text-center mb-4 max-w-md text-xl sm:text-2xl px-2">
          {slides[currentSlide].title}
        </h2>

        <p className="text-white/90 text-center max-w-sm text-sm sm:text-base px-2">
          {slides[currentSlide].description}
        </p>
      </div>

      {/* Indicators & Next */}
      <div className="p-6 sm:p-8 flex items-center justify-between flex-shrink-0">
        <div className="flex gap-2">
          {slides.map((_, index) => (
            <div
              key={index}
              className={`h-2 rounded-full transition-all ${index === currentSlide
                  ? 'w-8 bg-gray-50'
                  : 'w-2 bg-gray-50/40'
                }`}
            />
          ))}
        </div>

        <button
          onClick={handleNext}
          className="bg-gray-50 text-[#3D3066] px-5 py-3 sm:px-6 sm:py-3 rounded-full flex items-center gap-2 hover:bg-purple-50 transition-colors text-sm sm:text-base"
        >
          {currentSlide === slides.length - 1 ? 'Get Started' : 'Next'}
          <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </div>

      {/* Logo at bottom - Made to fit without scrolling */}
      <div className="pb-4 sm:pb-6 flex justify-center flex-shrink-0">
        <ZoldLogo variant="text" size="sm" theme="light" />
      </div>
    </div>
  );
}