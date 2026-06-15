import { ContactForm } from "@/components/web/ContactForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
};

export default function ContactPage() {
  return (
    <section className="w-full max-w-7xl mx-auto px-6 md:px-12 py-12 md:py-24 min-h-[calc(100vh-4rem)] flex items-center">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center w-full">
        
        <div className="lg:col-span-5 flex flex-col justify-center text-center lg:text-left max-w-md mx-auto lg:mx-0">
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl mb-4">
            Get in Touch
          </h1>
          <p className="text-base text-muted-foreground leading-relaxed">
            Have a question or want to work together? Drop us a message and our team will get back to you shortly.
          </p>
        </div>

        <div className="lg:col-span-7 w-full">
          <ContactForm />
        </div>

      </div>
    </section>
  );
}