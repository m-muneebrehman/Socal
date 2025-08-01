// src/app/loading.tsx
export default function Loading() {
  return (
    <div className="fixed inset-0 bg-charcoal z-50 flex flex-col justify-center items-center animate-fadeOut">
      <div className="font-serif text-4xl md:text-5xl font-light text-gold tracking-widest mb-8 opacity-0 animate-fadeIn">
        PRESTIGE ESTATES
      </div>
      <div className="w-72 h-px bg-gold/20 relative overflow-hidden">
        <div className="h-full bg-gradient-to-r from-transparent via-gold to-transparent w-full animate-[progressLoad_2s_ease-out_forwards]"></div>
      </div>
    </div>
  )
}