import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export function NewsletterCard() {
    return (
        <Card className="bg-gray-100 rounded-none border-none shadow-none flex flex-col md:flex-row justify-between p-8 gap-8">
            <div className="flex-1 max-w-xl flex flex-col gap-4">
                <div>
                    <p className="text-lg text-gray-500 uppercase tracking-wider mb-2">insights</p>
                    <h1 className="text-3xl font-bold leading-tight">
                        Lorem Ipsum: is simply dummy text of the printing and typesetting industry.
                    </h1>
                </div>
                <div className="flex gap-2 w-full mt-4">
                    <Input className="bg-white h-12 text-lg" placeholder="Enter your email" />
                    <Button className="h-12 text-lg px-6">Subscribe</Button> 
                </div>
            </div>

            <div className="flex-1 max-w-sm md:pt-10"> 
                <p className="text-xl text-gray-700 leading-relaxed">
                    Subscribe to learn more about our latest insights, news and product launches
                </p>
            </div>
        </Card>
    );
}