import { ContactForm } from "@/components/web/ContactForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
};

export default function ContactPage() {
  return (
    <section className="w-full h-[calc(100vh-4rem)] grid grid-cols-1 lg:grid-cols-12 gap-8 items-center py-6">
      
      <div className="lg:col-span-5 flex flex-col justify-center text-left max-w-md">
        <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl mb-4">
          Get in Touch
        </h1>
        <p className="text-base text-muted-foreground mb-2">
          Have a question or want to work together? Drop us a message and our team will get back to you shortly.
        </p>
      </div>

      <div className="lg:col-span-7 w-full max-h-full overflow-y-auto pr-2">
        <ContactForm />
      </div>

    </section>
  );
}