import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";

export default function About() {
  return (
    <div className="w-full p-6 md:p-12 box-border bg-background">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="flex flex-col justify-between overflow-hidden">
          <div className="w-full aspect-[16/10] bg-muted/20 flex items-center justify-center">
          </div>
          <CardHeader className="pt-2 flex flex-col gap-2">
            <CardTitle className="text-xl md:text-xl font-semibold tracking-tight">
              Providing tools that you need.
            </CardTitle>
            <CardContent className="p-0 text-sm md:text-base leading-relaxed text-muted-foreground">
              Delivering digital solutions to difficult problems. Pushing the bounds of what was thought possible.
            </CardContent>
          </CardHeader>
        </Card>

        <Card className="flex flex-col justify-between overflow-hidden">
          <div className="w-full aspect-[16/10] bg-muted/20 flex items-center justify-center">
          </div>
          <CardHeader className="pt-2 flex flex-col gap-2">
            <CardTitle className="text-xl md:text-xl font-semibold tracking-tight">
              Staying lean. Doing what other organisations can't.
            </CardTitle>
            <CardContent className="p-0 text-sm md:text-base leading-relaxed text-muted-foreground">
              Working with agility. Responding to the market. Out maneuvering enterprises.
            </CardContent>
          </CardHeader>
        </Card>

        <Card className="flex flex-col justify-between overflow-hidden">
          <div className="w-full aspect-[16/10] bg-muted/20 flex items-center justify-center">
          </div>
          <CardHeader className="pt-2 flex flex-col gap-2">
            <CardTitle className="text-xl md:text-xl font-semibold tracking-tight">
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