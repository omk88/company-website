import Technologies from "@/components/web/Technologies";
import VisionCards from "@/components/web/VisionCards";

export default function About() {
  return (
    <div className="min-h-screen w-full relative">
      <h1 className="mt-10 font-bold text-center text-2xl">Building software that delivers.</h1>
      <VisionCards />
      <div className="w-full max-w-7xl mx-auto p-6 md:p-12 relative z-10 box-border">
        <p className="p-0 text-sm md:text-base leading-relaxed text-accent-foreground">
          "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?"
        </p>
      </div>
      <Technologies />
    </div>
  );
}