import Image from "next/image";
import Link from "next/link";
import HeroIllustration from "@/assets/hero-illustration.png";
import { Steps } from "@/lib/constants";

const HeroSection = () => {
  return (
    <section className="wrapper pt-6 mb-10 md:mb-16">
      <div className="library-hero-card">
        <div className="library-hero-content">
          {/* Left – heading, description, CTA */}
          <div className="library-hero-text">
            <h1 className="library-hero-title">Your Library</h1>
            <p className="library-hero-description">
              Convert your books into interactive AI conversations. Listen,
              learn, and discuss your favorite reads.
            </p>
            {/* Mobile illustration */}
            <div className="library-hero-illustration">
              <Image
                src={HeroIllustration}
                alt="Vintage books and globe illustration"
                width={260}
                height={220}
                className="object-contain w-auto h-auto"
                priority
              />
            </div>
            <Link href="/books/new" className="library-cta-primary">
              <span>+</span>
              <span>Add new book</span>
            </Link>
          </div>
          {/* Center – illustration (sm and above) */}
          <div className="library-hero-illustration-desktop">
            <Image
              src={HeroIllustration}
              alt="Vintage books and globe illustration"
              width={340}
              height={290}
              className="object-contain w-auto h-auto max-h-[260px]"
              priority
            />
          </div>
          {/* Right – steps card */}
          <div className="library-steps-card flex flex-col self-center min-w-[190px] max-w-[220px]">
            {Steps.map((step, index) => (
              <div key={step.id}>
                <div className="library-step-item py-3">
                  <span className="library-step-number">{step.id}</span>
                  <div className="flex flex-col">
                    <span className="library-step-title">{step.title}</span>
                    <span className="library-step-description">
                      {step.description}
                    </span>
                  </div>
                </div>
                {index < Steps.length - 1 && (
                  <hr className="border-[var(--border-subtle)]" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

    </section>
  );
};

export default HeroSection;
