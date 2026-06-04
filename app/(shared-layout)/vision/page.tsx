import Technologies from "@/components/web/Technologies";
import VisionCards from "@/components/web/VisionCards";
import VisionDescription from "@/components/web/VisionDescription";

export default function About() {
  return (
    <div className="min-h-screen w-full relative">
      <h1 className="mt-10 font-bold text-center text-2xl">Building software that delivers.</h1>
      <VisionCards />
      <VisionDescription />
      <Technologies />
    </div>
  );
}