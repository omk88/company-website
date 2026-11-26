import ContactCards from "@/components/web/ContactCards";
import FAQSection from "@/components/web/FrequentlyAskedQuestions";
import { 
  CircleHelp, 
  MessageCircleQuestionMark, 
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function ContactPage() {

  return (
    <>
      <div className="pt-16 max-w-6xl mx-auto w-full border-x border-neutral-200 dark:border-neutral-800 flex-1">
        <div className="max-w-7xl mx-auto px-6 md:px-12 w-full flex-1 flex flex-col justify-end items-center gap-6">
          <div className="text-center space-y-3 max-w-xl shrink-0 flex flex-col items-center">

            <div 
              className={cn(
                "relative flex flex-col items-center w-full",
                "text-neutral-600 dark:text-neutral-400",
              )}
            >
              <h1
                className={cn(
                  "pb-2 text-2xl sm:text-3xl md:text-4xl", 
                  "font-semibold tracking-tight text-foreground",
                  "leading-tight max-w-3xl text-center"
                )}
              >
                Get in touch.
              </h1>
              <p className="max-w-lg mx-auto text-center font-light text-xl leading-relaxed">
                Have a question or want to work together? Drop us a message and our team will get back to you shortly.
              </p>
            </div>
          </div>

          <div className="w-full shrink-0">
            <ContactCards 
          />
          </div>
        </div>

        <div 
          className={cn(
            "relative flex flex-col items-center w-full my-12 py-12 px-4",
            "border-y border-neutral-200/80 dark:border-neutral-800/80",
            "text-neutral-600 dark:text-neutral-400",
            "bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#262626_1px,transparent_1px)]",
            "[background-size:16px_16px]"
          )}
        >
          <h2
            className={cn(
              "pb-4 text-2xl sm:text-3xl md:text-4xl", 
              "font-semibold tracking-tight text-foreground",
              "leading-tight max-w-3xl text-center"
            )}
          >
            We're working round the clock to get you the answers you need
          </h2>

          <p className="max-w-lg mx-auto text-center font-light text-xl leading-relaxed">
            Our support team works day and night to answer your questions. If you haven't recieved an answer yet - hang tight! We're moving fast to get you the information you need.
          </p>
        </div>

        <div id="faq-section" className="w-full bg-white dark:bg-zinc-950">
          <div className="max-w-7xl mx-auto px-6 pt-16 pb-24">
            <div className="mb-8 md:mb-6 flex flex-col justify-center md:justify-start gap-2.5 text-foreground">
              <div className="inline-flex w-fit items-center gap-1.5 px-3.5 py-1 rounded-full bg-white border border-gray-200/80 shadow-sm text-sm font-medium text-foreground">
                <CircleHelp className="w-4 h-4 text-foreground" />
                <span>FAQ</span>
              </div>
              <h3
                className={cn(
                  "text-2xl sm:text-3xl md:text-4xl", 
                  "font-semibold tracking-tight text-foreground",
                  "leading-tight max-w-3xl"
                )}
              >
                Frequently Asked Questions
              </h3>
              <p className="max-w-lg font-light text-xl leading-relaxed">
                Common questions asked by our users about our services.
              </p>
            </div>
            
            <FAQSection />

          </div>
        </div>
      </div>
    </>
  );
}