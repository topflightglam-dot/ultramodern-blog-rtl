export default function Video({ src, poster, autoPlay=false, muted=false }:{ src:string; poster?:string; autoPlay?:boolean; muted?:boolean }){
  return (
    <div className="w-full overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800">
      <video controls playsInline className="w-full h-auto" poster={poster} autoPlay={autoPlay} muted={muted} src={src} />
    </div>
  );
}
