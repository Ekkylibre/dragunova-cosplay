import Link from "next/link";

type ErrorPageProps = {
  code: string;
  title: string;
  description: string;
  action?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
  secondaryAction?: {
    label: string;
    href: string;
  };
};

export default function ErrorPage({
  code,
  title,
  description,
  action,
  secondaryAction,
}: ErrorPageProps) {
  const primaryClass =
    "cursor-pointer border border-cyan/40 px-8 py-3 font-mono text-xs uppercase tracking-[0.3em] text-cyan hover:bg-cyan/10 transition-colors";

  return (
    <main className="relative min-h-screen flex items-center justify-center overflow-hidden bg-ink px-6 py-20">
      <div
        aria-hidden
        className="aurora absolute -top-32 left-1/4 h-[28rem] w-[28rem] rounded-full bg-violet/15 blur-[120px]"
      />
      <div
        aria-hidden
        className="aurora absolute bottom-0 right-1/5 h-[24rem] w-[24rem] rounded-full bg-cyan/10 blur-[110px]"
        style={{ animationDelay: "-5s" }}
      />

      <div
        aria-hidden
        className="absolute inset-8 hidden md:block pointer-events-none"
      >
        <span className="absolute top-0 left-0 h-8 w-8 border-t border-l border-paper/25" />
        <span className="absolute top-0 right-0 h-8 w-8 border-t border-r border-paper/25" />
        <span className="absolute bottom-0 left-0 h-8 w-8 border-b border-l border-paper/25" />
        <span className="absolute bottom-0 right-0 h-8 w-8 border-b border-r border-paper/25" />
      </div>

      <div className="relative z-10 max-w-lg text-center">
        <p className="font-mono text-[0.6rem] uppercase tracking-[0.45em] text-cyan">
          ◆ Signal perdu ◆
        </p>

        <p
          className="font-display font-semibold text-[clamp(5rem,18vw,10rem)] leading-none mt-6 text-paper/15 select-none"
          aria-hidden
        >
          {code}
        </p>

        <h1 className="font-display text-2xl md:text-4xl font-medium text-arcane -mt-2 md:-mt-4">
          {title}
        </h1>

        <p className="mt-6 text-sm md:text-base text-paper-dim font-light leading-relaxed">
          {description}
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          {action &&
            (action.href ? (
              <Link href={action.href} className={primaryClass}>
                {action.label}
              </Link>
            ) : (
              <button type="button" onClick={action.onClick} className={primaryClass}>
                {action.label}
              </button>
            ))}
          {secondaryAction && (
            <Link
              href={secondaryAction.href}
              className="font-mono text-[0.6rem] uppercase tracking-[0.25em] text-paper-dim hover:text-violet transition-colors"
            >
              {secondaryAction.label}
            </Link>
          )}
        </div>
      </div>
    </main>
  );
}
