"use client";

import AutoScroll from "embla-carousel-auto-scroll";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

interface Logo {
  id: string;
  description: string;
  image?: string;
  text?: string;
  className?: string;
}

interface Logos3Props {
  heading?: string;
  logos?: Logo[];
  className?: string;
}

const Logos3 = ({
  logos = [
    {
      id: "logo-1",
      description: "OpenAI",
      image: "https://html.tailus.io/blocks/customers/openai.svg",
      className: "h-5 w-auto dark:invert",
    },
    {
      id: "logo-2",
      description: "GitHub",
      image: "https://html.tailus.io/blocks/customers/github.svg",
      className: "h-4 w-auto dark:invert",
    },
    {
      id: "logo-3",
      description: "NVIDIA",
      image: "https://html.tailus.io/blocks/customers/nvidia.svg",
      className: "h-4 w-auto dark:invert",
    },
    {
      id: "logo-4",
      description: "Laravel",
      image: "https://html.tailus.io/blocks/customers/laravel.svg",
      className: "h-5 w-auto dark:invert",
    },
    {
      id: "logo-5",
      description: "Claude",
      text: "Claude",
      className: "h-5 flex items-center justify-center text-sm font-semibold text-white/70",
    },
    {
      id: "logo-6",
      description: "Gemini",
      text: "Gemini",
      className: "h-4 flex items-center justify-center text-sm font-semibold text-white/70",
    },
    {
      id: "logo-7",
      description: "Mistral",
      text: "Mistral",
      className: "h-7 flex items-center justify-center text-sm font-semibold text-white/70",
    },
    {
      id: "logo-8",
      description: "LLaMA",
      text: "LLaMA",
      className: "h-6 flex items-center justify-center text-sm font-semibold text-white/70",
    },
  ],
}: Logos3Props) => {
  return (
    <section className="py-16 relative bg-transparent">
      {/* Blur gradients for smooth edges */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-black/80 to-transparent z-10"></div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/80 to-transparent z-10"></div>
      </div>
      
      <div className="relative">
        <Carousel
          opts={{ loop: true, align: "start" }}
          plugins={[AutoScroll({ playOnInit: true, speed: 0.5, stopOnInteraction: false })]}
        >
          <CarouselContent className="ml-0">
            {[...logos, ...logos].map((logo, index) => (
              <CarouselItem
                key={`${logo.id}-${index}`}
                className="flex basis-1/3 justify-center pl-0 sm:basis-1/4 md:basis-1/5 lg:basis-1/6"
              >
                <div className="mx-8 flex shrink-0 items-center justify-center">
                  <div>
                    {logo.image ? (
                      <Image
                        src={logo.image}
                        alt={logo.description}
                        width={120}
                        height={40}
                        className={logo.className}
                      />
                    ) : (
                      <div className={logo.className}>
                        {logo.text}
                      </div>
                    )}
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
        
        {/* Side fade effects */}
        <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-black/80 to-transparent z-10"></div>
        <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-black/80 to-transparent z-10"></div>
      </div>
    </section>
  );
};

export { Logos3 };