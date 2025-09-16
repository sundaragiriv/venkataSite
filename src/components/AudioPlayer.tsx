export default function AudioPlayer({ src }: { src: string }) {
  return <audio className="w-full mt-3" controls preload="none" src={src} />;
}