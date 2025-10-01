import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";

/* eslint-disable @next/next/no-img-element */
const Thumbnail = ({ url }: { url: string | null | undefined }) => {
  if (!url) return null;
  return (
    <Dialog>
      <DialogTrigger>
        <div className="relative overflow-hidden max-w-[360px] border rounded-lg my-2 cursor-zoom-in">
          <img
            src={url}
            alt="Thumbnail"
            className="object-cover w-full h-full"
          />
        </div>
      </DialogTrigger>
      <DialogContent className="max-w-[800px] border-none p-0 shadow-none bg-transparent">
        <img src={url} alt="Thumbnail" className="object-cover w-full h-full" />
      </DialogContent>
    </Dialog>
  );
};

export default Thumbnail;
