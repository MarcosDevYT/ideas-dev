import { UserWithDetails } from "@/types/user-types";
import { Navbar } from "./navbar";
import { HeroSection } from "./home/hero-section";
import { FeaturesBento } from "./home/features-bento";
import { HowItWorks } from "./home/how-it-works";
import { TargetAudience } from "./home/target-audience";
import { CtaFooter } from "./home/cta-footer";

interface HomeProps {
  user: UserWithDetails;
}

export const Home = ({ user }: HomeProps) => {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground overflow-x-hidden">
      <Navbar user={user} />
      <main className="flex-1 w-full">
        <HeroSection />
        <FeaturesBento />
        <HowItWorks />
        <TargetAudience />
        <CtaFooter />
      </main>
    </div>
  );
};
