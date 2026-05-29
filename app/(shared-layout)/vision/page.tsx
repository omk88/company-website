import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";

export default function About() {
  return (
    <div className="min-h-screen w-full flex flex-col justify-between p-6 md:p-12 box-border bg-background">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-grow">
        <Card className="flex flex-col justify-between overflow-hidden">
          <div className="w-full aspect-[4/3] bg-muted/20 flex items-center justify-center">
          </div>
          <CardHeader className="pt-2 flex flex-col gap-2">
            <CardTitle className="text-xl md:text-2xl font-semibold tracking-tight">
              Tailored Development Solutions
            </CardTitle>
            <CardContent className="p-0 text-sm md:text-base leading-relaxed text-muted-foreground">
              Providing customized digital tools and services designed to meet your specific needs. Fully responsive and scaleable.
            </CardContent>
          </CardHeader>
        </Card>

        <Card className="flex flex-col justify-between overflow-hidden">
          <div className="w-full aspect-[4/3] bg-muted/20 flex items-center justify-center">
          </div>
          <CardHeader className="pt-2 flex flex-col gap-2">
            <CardTitle className="text-xl md:text-2xl font-semibold tracking-tight">
              Full-Stack Application Development
            </CardTitle>
            <CardContent className="p-0 text-sm md:text-base leading-relaxed text-muted-foreground">
              Build robust, server-side rendered applications. Focus on performance, SEO, and developer experience.
            </CardContent>
          </CardHeader>
        </Card>

        <Card className="flex flex-col justify-between overflow-hidden">
          <div className="w-full aspect-[4/3] bg-muted/20 flex items-center justify-center">
          </div>
          <CardHeader className="pt-2 flex flex-col gap-2">
            <CardTitle className="text-xl md:text-2xl font-semibold tracking-tight">
              Cloud Infrastructure & Integration
            </CardTitle>
            <CardContent className="p-0 text-sm md:text-base leading-relaxed text-muted-foreground">
              Delivering secure, scalable cloud architectures. Pushing the limits of modern deployment pipelines.
            </CardContent>
          </CardHeader>
        </Card>

      </div>
    </div>
  );
}