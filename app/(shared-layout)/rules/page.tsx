import Footer from "@/components/web/Footer";
import { PLATFORM_RULES } from "@/constants/rules";

export default function PlatformRules() {
  const lastUpdated = "2026-10-02";

  return (
    <>
      <div className="min-h-screen bg-background text-foreground pt-14 pb-20 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <header className="border-b border-border pb-8 mb-12">
            <h1 className="text-4xl font-bold tracking-tight mb-3 sm:text-5xl">
              Platform Rules
            </h1>
            <p className="text-sm text-muted-foreground">
              Updated at: <time dateTime={lastUpdated}>{lastUpdated}</time>
            </p>
          </header>

          <div className="space-y-7">
            {PLATFORM_RULES.map((rule) => (
              <section
                key={rule.id}
                id={rule.id}
                className="scroll-mt-20 border-t border-border/40 pt-8 first:border-t-0 first:pt-0"
              >
                <h2 className="text-xl font-semibold tracking-tight text-foreground mb-4">
                  {rule.title}
                </h2>
                <div className="text-base leading-relaxed text-muted-foreground space-y-4">
                  <p>{rule.description}</p>
                </div>
              </section>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}