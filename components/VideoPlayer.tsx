interface VideoPlayerProps {
    url: string;
    name?: string;
}

export default function VideoPlayer({ url, name }: VideoPlayerProps) {
    return (
        <div className="flex flex-col items-center gap-4 w-full max-w-2xl">
            {name && (
                <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                    {name}
                </h2>
            )}
            <video
                controls
                preload="metadata"
                className="w-full rounded-lg shadow-lg bg-black aspect-video"
                src={url}
            >
                Your browser does not support the video tag.
            </video>
        </div>
    );
}