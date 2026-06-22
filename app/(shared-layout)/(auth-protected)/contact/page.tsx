import ContactCards from "@/components/web/ContactCards";
import { ContactForm } from "@/components/web/ContactForm";
import FAQSection from "@/components/web/FrequentlyAskedQuestions";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
};

export default function ContactPage() {
  return (
    <section className="w-full max-w-7xl mx-auto pl-6 md:pl-12 pr-4 md:pr-6 pb-12 min-h-[calc(100vh-4rem)]">
      <div className="flex flex-col gap-10 md:gap-14 w-full mt-6 md:mt-10">
        
        <div className="flex flex-col text-center md:text-left max-w-2xl">
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl mb-4 font-sans">
            Get in Touch
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed font-mono">
            Have a question or want to work together? Drop us a message and our team will get back to you shortly.
          </p>
        </div>

        <div className="w-full">
          <ContactCards />
        </div>

        <div className="w-full">
          <FAQSection />
        </div>

        <div className="w-full max-w-3xl mx-auto md:mx-0">
          <ContactForm />
        </div>


      </div>
    </section>
  );
}