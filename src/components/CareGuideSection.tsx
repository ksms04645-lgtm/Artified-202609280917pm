import React, { useState } from 'react';
import { Sparkles, Shield, ChevronDown, ChevronUp, Droplets, Sun, Wind, HelpCircle } from 'lucide-react';
import { FAQS } from '../data/products';

export const CareGuideSection: React.FC = () => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <section id="care-section" className="py-14 sm:py-20 bg-[#FAF8F5] border-b border-[#E8DFD8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Care Instructions Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#E8DFD8] text-[10px] tracking-[0.2em] font-bold uppercase text-[#8C7A6B] mb-3">
            <Sparkles className="w-3 h-3 text-[#C5A880]" />
            <span>Preserving Your Heirloom</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#1C1B1A] font-semibold">
            Pearl & Macrame Care Guide
          </h2>
          <p className="text-xs sm:text-sm text-[#736C65] mt-2">
            Natural pearls and organic cotton knots require gentle mindfulness to maintain their radiant luster for decades.
          </p>
        </div>

        {/* 4 Care Rules Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-16">
          <div className="bg-white p-5 rounded-2xl border border-[#E8DFD8] shadow-2xs space-y-2">
            <div className="w-10 h-10 rounded-xl bg-[#FAF8F5] border border-[#E8DFD8] flex items-center justify-center text-[#C5A880]">
              <Droplets className="w-5 h-5" />
            </div>
            <h4 className="text-xs font-bold text-[#1C1B1A] uppercase tracking-wider">
              Last On, First Off
            </h4>
            <p className="text-xs text-[#736C65] leading-relaxed">
              Always put on pearl jewelry and carry your pearl bag after applying perfumes, deodorants, hairspray, and lotions to prevent organic pearl degradation.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#E8DFD8] shadow-2xs space-y-2">
            <div className="w-10 h-10 rounded-xl bg-[#FAF8F5] border border-[#E8DFD8] flex items-center justify-center text-[#C5A880]">
              <Wind className="w-5 h-5" />
            </div>
            <h4 className="text-xs font-bold text-[#1C1B1A] uppercase tracking-wider">
              Gentle Wipe Only
            </h4>
            <p className="text-xs text-[#736C65] leading-relaxed">
              After wearing, wipe pearls with a clean dry microfiber cloth. Never submerge structured pearl bags in water or use harsh chemicals.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#E8DFD8] shadow-2xs space-y-2">
            <div className="w-10 h-10 rounded-xl bg-[#FAF8F5] border border-[#E8DFD8] flex items-center justify-center text-[#C5A880]">
              <Shield className="w-5 h-5" />
            </div>
            <h4 className="text-xs font-bold text-[#1C1B1A] uppercase tracking-wider">
              Cotton Dust Pouch Storage
            </h4>
            <p className="text-xs text-[#736C65] leading-relaxed">
              Store your pearl bags inside the complimentary breathable cotton dust bag provided. Never store in airtight plastic bags that dehydrate pearls.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#E8DFD8] shadow-2xs space-y-2">
            <div className="w-10 h-10 rounded-xl bg-[#FAF8F5] border border-[#E8DFD8] flex items-center justify-center text-[#C5A880]">
              <Sun className="w-5 h-5" />
            </div>
            <h4 className="text-xs font-bold text-[#1C1B1A] uppercase tracking-wider">
              Macrame Fringe Care
            </h4>
            <p className="text-xs text-[#736C65] leading-relaxed">
              For cotton macrame fringes, gently stroke with a wide-toothed comb to straighten tassels. Hand-spot wash only with mild soap and dry flat.
            </p>
          </div>
        </div>

        {/* Frequently Asked Questions */}
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider font-semibold text-[#8C7A6B]">
              <HelpCircle className="w-4 h-4 text-[#C5A880]" />
              <span>Ordering & Delivery in Nepal</span>
            </div>
            <h3 className="font-serif text-2xl sm:text-3xl font-semibold text-[#1C1B1A] mt-1">
              Frequently Asked Questions
            </h3>
          </div>

          <div className="space-y-3">
            {FAQS.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-xl border border-[#E8DFD8] overflow-hidden transition-all shadow-2xs"
                >
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full p-4 sm:p-5 flex items-center justify-between text-left gap-4"
                  >
                    <span className="text-xs sm:text-sm font-semibold text-[#1C1B1A]">
                      {faq.q}
                    </span>
                    <span className="p-1 rounded-full bg-[#FAF8F5] text-[#8C7A6B] shrink-0">
                      {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </span>
                  </button>

                  {isOpen && (
                    <div className="px-4 sm:px-5 pb-5 text-xs text-[#5E5955] leading-relaxed border-t border-[#F0EBE5] pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};
