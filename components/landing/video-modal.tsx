import { SparklesIcon } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
const VideoModal = () => {
  return (
    <Dialog>
      <DialogTrigger>
        <span className="group flex items-center gap-2 rounded-full bg-white/95 px-6 py-3 transition-all duration-300 hover:scale-105 hover:shadow-lg">
          Explore Now
          <SparklesIcon className="h-4 w-4 transition-all duration-300 group-hover:-translate-y-[3px]" />
        </span>
      </DialogTrigger>
      <DialogContent className="max-w-screen-md bg-transparent">
        <video
          src="/vid.mp4"
          autoPlay
          playsInline
          controls
          loop
          muted
          className="object-cover"
        />
      </DialogContent>
    </Dialog>
  );
};

export default VideoModal;
