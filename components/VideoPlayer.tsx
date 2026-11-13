interface VideoPlayerProps {
    url: string;
    name?: string;
}

export default function VideoPlayer({ url, name }: VideoPlayerProps) {
    return (
        <div className="flex flex-col items-center gap-4 w-full">
            <video
                controls
                preload="metadata"
                className="w-full bg-black aspect-video"
                src={url}
            >
                Your browser does not support the video tag.
            </video>
        </div>
    );
}