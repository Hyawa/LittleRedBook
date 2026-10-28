import type { ReactNode } from 'react'
import { book } from '@/lib/book'
import { Star } from './Star'

export function BookCover({ children }: { children?: ReactNode }) {
  return (
    <section
      aria-label="Capa de Citações do Presidente Mao Zedong"
      className="relative overflow-hidden rounded-[1.75rem] border border-[#4d080c] bg-[linear-gradient(155deg,#a41b23_0%,#8a1119_38%,#6d0b12_72%,#52070c_100%)] shadow-[0_34px_64px_-34px_rgba(74,10,15,.8),inset_0_1px_0_rgba(255,255,255,.14)]"
    >
      <div
        aria-hidden="true"
        className="absolute inset-[7px] rounded-[1.4rem] border border-[#e6ce97]/35"
      />
      <div
        aria-hidden="true"
        className="absolute inset-[11px] rounded-[1.3rem] border border-[#e6ce97]/10"
      />
      <Star
        aria-hidden="true"
        className="absolute -right-16 -bottom-20 size-64 rotate-12 text-[#f0d99f]/[0.055]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(130%_85%_at_12%_0%,rgba(255,224,160,.14),transparent_58%)]"
      />

      <div className="relative px-6 pt-7 pb-6 sm:px-9 sm:pt-9 sm:pb-8">
        <div className="flex items-center justify-between gap-4">
          <span className="label-caps text-[0.54rem] text-[#f0d99f]/75">
            Edição de 1972
          </span>
          <span className="label-caps flex items-center gap-2 text-[0.54rem] text-[#f0d99f]/55">
            <span aria-hidden="true" className="h-px w-5 bg-current" />
            Livro Vermelho
          </span>
        </div>

        <div
          aria-hidden="true"
          className="mt-7 flex items-center gap-3"
        >
          <span className="h-px flex-1 bg-gradient-to-r from-transparent to-[#e6ce97]/40" />
          <Star className="size-3.5 text-[#f0d99f]" />
          <span className="h-px flex-1 bg-gradient-to-l from-transparent to-[#e6ce97]/40" />
        </div>

        <h1 className="mt-5">
          <span className="cover-foil block font-display text-[3.15rem] leading-[0.86] font-semibold tracking-[-0.018em] sm:text-[4.3rem]">
            Citações
          </span>
          <span className="mt-3.5 block font-label text-[0.58rem] tracking-[0.27em] text-[#f0d99f]/85 uppercase sm:text-[0.65rem]">
            do Presidente Mao Zedong
          </span>
        </h1>

        <p className="mt-4 max-w-[34ch] font-serif text-[0.95rem] leading-relaxed text-[#f3e3c2]/70">
          Texto integral da edição de 1972, organizado em 33 seções.
        </p>

        <div className="mt-6 flex items-center gap-3 border-t border-[#e6ce97]/20 pt-4 text-[0.58rem] tracking-[0.16em] text-[#f0d99f]/65 uppercase">
          <span>{book.chapters.length} seções</span>
          <Star className="size-1.5 text-[#f0d99f]/50" />
          <span>{book.total} citações</span>
        </div>

        {children ? <div className="mt-5">{children}</div> : null}
      </div>

      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 w-1/3 -translate-x-[160%] rotate-6 bg-gradient-to-r from-transparent via-white/10 to-transparent motion-safe:animate-[cover-shine_2.4s_ease-out_.6s_1]"
      />
    </section>
  )
}
