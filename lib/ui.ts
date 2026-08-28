const base =
  "inline-flex min-h-11 items-center justify-center rounded-[6px] px-4 text-[15px] font-medium transition-[color,background-color,border-color,transform] duration-150 ease-out active:scale-[0.98]";

// Repository is the one action every entry has, so it carries the loudest color.
export const btnBrand = `${base} bg-signal text-bg hover:bg-signal-hover`;
export const btnPrimary = `${base} bg-accent text-ink hover:bg-accent-hover`;
export const btnSecondary = `${base} border border-line text-ink hover:border-line-strong hover:bg-bg-elevated`;

export const inlineLink =
  "text-accent-ink underline decoration-line-strong underline-offset-4 transition-colors duration-150 hover:text-ink hover:decoration-accent-ink";
