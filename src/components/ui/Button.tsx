import Link from "next/link";

import { cn } from "@/lib/cn";

type Variant = "solid" | "outline";

const base =
  "inline-flex items-center justify-center gap-2 rounded-pill text-base " +
  "font-medium whitespace-nowrap transition-colors duration-[--dur-base] " +
  "px-6 py-3.5";

const variants: Record<Variant, string> = {
  solid: "bg-ink text-ink-inverse hover:bg-ink/85",
  outline:
    "bg-bg-raised text-ink shadow-raised ring-1 ring-line hover:bg-bg-inset",
};

/**
 * A pill button, as a link or a button.
 *
 * Every interactive surface on this page is a pill, so the radius is not a
 * per-call-site decision. `href` picks the element: an internal path renders
 * a Link, an external or protocol URL renders a plain anchor, and no href at
 * all renders a real <button>.
 */
export function Button({
  children,
  href,
  variant = "solid",
  className,
  type = "button",
  onClick,
  ...rest
}: {
  children: React.ReactNode;
  href?: string | null;
  variant?: Variant;
  className?: string;
  type?: "button" | "submit";
  onClick?: () => void;
} & Pick<React.HTMLAttributes<HTMLElement>, "aria-label">) {
  const classes = cn(base, variants[variant], className);

  if (!href) {
    return (
      <button type={type} onClick={onClick} className={classes} {...rest}>
        {children}
      </button>
    );
  }

  // Anything that isn't a site-relative path leaves the app, so it must not
  // go through Link — including mailto: and tel:, which Link cannot route.
  const isInternal = href.startsWith("/") && !href.startsWith("//");

  if (!isInternal) {
    const isProtocol = /^[a-z]+:/i.test(href) && !href.startsWith("http");
    return (
      <a
        href={href}
        className={classes}
        {...(isProtocol
          ? {}
          : { target: "_blank", rel: "noopener noreferrer" })}
        {...rest}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href as never} className={classes} {...rest}>
      {children}
    </Link>
  );
}

/** The trailing arrow on the primary call to action. */
export function ArrowRight() {
  return (
    <svg
      viewBox="0 0 16 16"
      className="size-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 8h10M9 4l4 4-4 4" />
    </svg>
  );
}

/** The leading triangle on the showreel button. */
export function PlayIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      className="size-3"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M4 2.5v11l9-5.5-9-5.5z" />
    </svg>
  );
}

/** The small north-east arrow used on "View Project" and outbound links. */
export function ArrowUpRight({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      className={cn("size-3.5", className)}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 11l6-6M6 5h5v5" />
    </svg>
  );
}
