/**
 * Very soft, static warm amber-and-orange atmosphere behind the hero. Decorative only. All
 * pointer-driven ambience lives in NeuralField, so this layer stays perfectly still.
 */
export function GlowBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden [mask-image:linear-gradient(to_bottom,black_55%,transparent)]"
    >
      <div className="absolute -top-1/3 -left-1/4 h-[40rem] w-[40rem] rounded-full bg-amber-500/10 blur-[140px]" />
      <div className="absolute -right-1/4 bottom-0 h-[34rem] w-[34rem] rounded-full bg-ember-500/[0.08] blur-[140px]" />
    </div>
  )
}
