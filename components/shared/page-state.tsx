import Link from "next/link";
import { Button } from "@/components/ui/button";

export function LoadingState({ label = "Loading..." }: { label?: string }) {
  return (
    <div className="flex min-h-48 items-center justify-center p-6 text-sm text-muted-foreground" role="status">
      {label}
    </div>
  );
}

export function ErrorState({
  title = "Something went wrong",
  description = "We could not load this content. Please try again.",
  onRetry,
}: {
  title?: string;
  description?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="flex min-h-48 flex-col items-center justify-center gap-3 p-6 text-center">
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="max-w-md text-sm text-muted-foreground">{description}</p>
      {onRetry ? <Button onClick={onRetry}>Try again</Button> : null}
    </div>
  );
}

export function EmptyState({
  title,
  description,
  href,
  actionLabel,
}: {
  title: string;
  description: string;
  href?: string;
  actionLabel?: string;
}) {
  return (
    <div className="flex min-h-48 flex-col items-center justify-center gap-3 p-6 text-center">
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="max-w-md text-sm text-muted-foreground">{description}</p>
      {href && actionLabel ? (
        <Button asChild>
          <Link href={href}>{actionLabel}</Link>
        </Button>
      ) : null}
    </div>
  );
}