import { Hero } from '@/components/home/Hero';
import { FeaturedCollections } from '@/components/home/FeaturedCollections';
import { BestSellers } from '@/components/home/BestSellers';
import { CustomizeSection } from '@/components/home/CustomizeSection';
import { WhySection } from '@/components/home/WhySection';
import { FinalCTA } from '@/components/home/FinalCTA';

export default function HomePage() {
  return (
    <>
      <Hero />
      <FeaturedCollections />
      <BestSellers />
      <CustomizeSection />
      <WhySection />
      <FinalCTA />
    </>
  );
}
