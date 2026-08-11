import FilmGrain from "./FilmGrain";

/*
  Atmosphere stack: grade → vignette → grain → light sweep → readability.
  Pseudo-layer ordering per the cinematic spec (z-20/z-30 band).
*/
export default function Atmosphere() {
  return (
    <>
      <div aria-hidden="true" className="s3-vignette pointer-events-none absolute inset-0 z-30" />
      <FilmGrain />
      <div aria-hidden="true" data-s3="sweep" className="s3-sweep pointer-events-none absolute inset-0 z-30" />
      {/* text safe area (right zone on desktop) */}
      <div aria-hidden="true" className="s3-readability-right pointer-events-none absolute inset-y-0 right-0 z-20 hidden w-[46%] md:block" />
    </>
  );
}