import * as React from "react"
import { AlertCircle, Box, ChevronLeft, ChevronRight, Inbox, LoaderCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export function PageContainer({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("gearup-container", className)} {...props} />
}

export function Typography({
  as: Component = "p",
  variant = "body",
  className,
  ...props
}: React.ComponentProps<"p"> & {
  as?: "p" | "span" | "h1" | "h2" | "h3" | "h4"
  variant?: "display" | "h1" | "h2" | "h3" | "body" | "small" | "caption"
}) {
  return <Component className={cn(`gearup-${variant}`, className)} {...props} />
}

const badgeStyles = {
  placed: "bg-[#fef3c7] text-[#92400e]",
  confirmed: "bg-[#eff4ff] text-[#1d4ed8]",
  paid: "bg-[#ede9fe] text-[#5b21b6]",
  picked_up: "bg-[#dcfce7] text-[#166534]",
  returned: "bg-[#f1f5f9] text-[#475569]",
  cancelled: "bg-[#fee2e2] text-[#991b1b]",
  active: "bg-[#dcfce7] text-[#166534]",
  suspended: "bg-[#fee2e2] text-[#991b1b]",
  available: "bg-[#dcfce7] text-[#166534]",
  unavailable: "bg-card text-muted-foreground border-border",
  outline: "border-border bg-card text-muted-foreground",
} as const

export function Badge({
  tone = "outline",
  dot = true,
  className,
  children,
  ...props
}: React.ComponentProps<"span"> & {
  tone?: keyof typeof badgeStyles
  dot?: boolean
}) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full border border-transparent px-2.5 py-1 text-xs font-bold", badgeStyles[tone], className)} {...props}>
      {dot ? <span className="size-1.5 rounded-full bg-current" /> : null}
      {children}
    </span>
  )
}

export function FormField({
  label,
  htmlFor,
  required,
  hint,
  error,
  className,
  children,
}: {
  label: string
  htmlFor?: string
  required?: boolean
  hint?: string
  error?: string
  className?: string
  children: React.ReactNode
}) {
  return (
    <div className={cn("mb-[18px]", className)}>
      <label htmlFor={htmlFor} className="mb-1.5 block text-[13px] font-semibold text-foreground">
        {label} {required ? <span className="text-destructive">*</span> : null}
      </label>
      {children}
      {error ? <p className="mt-1.5 flex items-center gap-1 text-xs text-destructive"><AlertCircle className="size-3.5" />{error}</p> : hint ? <p className="mt-1.5 text-xs text-muted-foreground">{hint}</p> : null}
    </div>
  )
}

export function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("animate-[gearup-shimmer_1.4s_ease_infinite] rounded-md bg-[linear-gradient(90deg,#eef1f5_25%,#f6f8fa_37%,#eef1f5_63%)] bg-[length:400%_100%]", className)} {...props} />
}

export function SkeletonCard({ className }: { className?: string }) {
  return <div className={cn("gearup-card overflow-hidden", className)}><Skeleton className="aspect-[4/3] rounded-none" /><Skeleton className="mx-4 my-3 h-3 w-2/5" /><Skeleton className="mx-4 my-3 h-3 w-3/4" /><Skeleton className="mx-4 my-3 h-3 w-1/2" /></div>
}

export function EmptyState({ title, description, action, className }: { title: string; description: string; action?: React.ReactNode; className?: string }) {
  return <StateBlock icon={<Box />} title={title} description={description} className={className}>{action}</StateBlock>
}

export function ErrorState({ title = "Something went wrong", description = "We could not load this content. Please try again.", onRetry, className }: { title?: string; description?: string; onRetry?: () => void; className?: string }) {
  return <StateBlock icon={<AlertCircle />} title={title} description={description} className={className}>{onRetry ? <Button size="sm" onClick={onRetry}>Try again</Button> : null}</StateBlock>
}

export function LoadingState({ label = "Loading...", className }: { label?: string; className?: string }) {
  return <StateBlock icon={<LoaderCircle className="animate-spin text-primary" />} title={label} className={className} />
}

function StateBlock({ icon, title, description, children, className }: { icon: React.ReactNode; title: string; description?: string; children?: React.ReactNode; className?: string }) {
  return <div className={cn("flex min-h-48 flex-col items-center justify-center p-6 text-center", className)}><span className="mb-2 flex size-14 items-center justify-center rounded-full bg-muted text-muted-foreground [&_svg]:size-6">{icon}</span><h3 className="gearup-h3 text-lg">{title}</h3>{description ? <p className="mt-2 max-w-[340px] text-sm text-muted-foreground">{description}</p> : null}{children ? <div className="mt-5">{children}</div> : null}</div>
}

export function ResponsiveGrid({ columns = 3, className, ...props }: React.ComponentProps<"div"> & { columns?: 2 | 3 | 4 }) {
  const columnsClass = { 2: "grid-cols-1 sm:grid-cols-2", 3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3", 4: "grid-cols-2 lg:grid-cols-4" }[columns]
  return <div className={cn("grid gap-5", columnsClass, className)} {...props} />
}

export function DashboardPanel({ title, action, className, children, ...props }: React.ComponentProps<"section"> & { title?: React.ReactNode; action?: React.ReactNode }) {
  return <section className={cn("gearup-panel mb-6", className)} {...props}>{title || action ? <div className="mb-[18px] flex flex-wrap items-center justify-between gap-3"><h2 className="gearup-h3">{title}</h2>{action}</div> : null}{children}</section>
}

export function DialogSurface({ open = true, onClose, title, description, children, actions, className }: { open?: boolean; onClose?: () => void; title: React.ReactNode; description?: React.ReactNode; children?: React.ReactNode; actions?: React.ReactNode; className?: string }) {
  if (!open) return null
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/45 p-5" role="dialog" aria-modal="true" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose?.() }}><div className={cn("w-full max-w-[420px] rounded-2xl bg-card p-[26px] shadow-[var(--shadow-modal)]", className)}><h2 className="gearup-h3">{title}</h2>{description ? <p className="mt-2 gearup-small">{description}</p> : null}{children}{actions ? <div className="mt-[22px] flex gap-2.5 [&>*]:flex-1">{actions}</div> : null}</div></div>
}

export function DataTable({ columns, rows, getRowKey, className }: { columns: Array<{ key: string; header: React.ReactNode; className?: string }>; rows: Array<Record<string, React.ReactNode>>; getRowKey?: (row: Record<string, React.ReactNode>, index: number) => React.Key; className?: string }) {
  return <div className={cn("gearup-table-wrap", className)}><table className="gearup-table"><thead><tr>{columns.map((column) => <th className={column.className} key={column.key}>{column.header}</th>)}</tr></thead><tbody>{rows.map((row, index) => <tr key={getRowKey?.(row, index) ?? index}>{columns.map((column) => <td className={column.className} key={column.key}>{row[column.key]}</td>)}</tr>)}</tbody></table></div>
}

export function Pagination({ page, pageCount, onPageChange }: { page: number; pageCount: number; onPageChange: (page: number) => void }) {
  if (pageCount < 2) return null
  return <nav aria-label="Pagination" className="mt-5 flex items-center justify-center gap-1.5"><Button variant="outline" size="icon-xs" aria-label="Previous page" disabled={page === 1} onClick={() => onPageChange(page - 1)}><ChevronLeft /></Button>{Array.from({ length: pageCount }, (_, index) => index + 1).map((item) => <Button key={item} variant={item === page ? "default" : "outline"} size="icon-xs" aria-current={item === page ? "page" : undefined} onClick={() => onPageChange(item)}>{item}</Button>)}<Button variant="outline" size="icon-xs" aria-label="Next page" disabled={page === pageCount} onClick={() => onPageChange(page + 1)}><ChevronRight /></Button></nav>
}

export function ToastPreview({ tone = "default", children }: { tone?: "default" | "success" | "error"; children: React.ReactNode }) {
  const toneClass = { default: "bg-foreground", success: "bg-[#166534]", error: "bg-[#991b1b]" }[tone]
  return <div className={cn("flex min-w-[280px] max-w-[360px] items-start gap-2.5 rounded-md px-4 py-3.5 text-sm font-medium text-white shadow-[var(--shadow-modal)]", toneClass)}><Inbox className="mt-0.5 size-4 shrink-0" />{children}</div>
}
