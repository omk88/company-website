import Footer from "@/components/web/Footer";

interface RulesSections {
  id: string;
  title: string;
  content: React.ReactNode;
}

export default function PlatformRules() {

  const lastUpdated = "2026-10-02";

  const sections: RulesSections[] = [
  {
    id: "rule1",
    title: "Keep content on topic.",
    content: (
        <div>
            <span>This is a tech blog, try to keep all content about technology and coding/programming. Content that is off topic will be removed.</span>
        </div>
    )},
    {
    id: "rule2",
    title: "No explicit content.",
    content: (
        <div>
            <span>Any explicit/adult/pornographic content will be removed and you will be banned.</span>
        </div>
    )},
    {
    id: "rule3",
    title: "No plagiarism.",
    content: (
        <div>
            <span>Plagarised content will be removed. Cross posting content is fine but stealing somebody elses content will get you banned.</span>
        </div>
    )},
    {
    id: "rule4",
    title: "Do not post low value content.",
    content: (
        <div>
            <span>Content that is low effort and low value will be removed. This includes content that is entirely or almost entirely AI generated.</span>
        </div>
    )},
    {
    id: "rule5",
    title: "Don't post peoples private information without permission.",
    content: (
        <div>
            <span>Any post containing personal information without permission from that individual (such as their physical address) will be removed immediately and you will be banned.</span>
        </div>
    )},
  ]

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
            {sections.map((section) => (
              <section key={section.id} id={section.id} className="scroll-mt-20 border-t border-border/40 pt-8 first:border-t-0 first:pt-0">
                <h2 className="text-xl font-semibold tracking-tight text-foreground mb-4">
                  {section.title}
                </h2>
                <div className="text-base leading-relaxed text-muted-foreground space-y-4">
                  {section.content}
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