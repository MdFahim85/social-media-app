import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";

export function ImageCarousel({ images }: { images: string[] }) {
  return (
    <div className="w-full max-w-2xl mx-auto mb-4">
      <Carousel className="relative w-full">
        <CarouselContent>
          {images.map((image, index) => (
            <CarouselItem key={index}>
              <CardContent className="flex items-center justify-center p-0">
                <div className="relative w-full h-64 sm:h-80 md:h-[400px]">
                  <Image
                    src={image}
                    alt={`Post Image ${index + 1}`}
                    fill
                    priority={index === 0}
                    className="object-contain"
                  />
                </div>
              </CardContent>
            </CarouselItem>
          ))}
        </CarouselContent>
        {images.length > 1 && (
          <>
            <CarouselPrevious className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white hover:bg-black/70 transition rounded-full p-2" />
            <CarouselNext className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white hover:bg-black/70 transition rounded-full p-2" />
          </>
        )}
      </Carousel>
    </div>
  );
}
