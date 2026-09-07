import { DashboardPanel, EmptyState, ErrorState, PageContainer } from "@/components/ui/gearup";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/shared/status-badge";
import { DashboardShell as ProtectedDashboardShell } from "@/components/dashboard/dashboard-shell";
import { PaymentButton, ReviewForm } from "@/components/customer/customer-actions";
import { getMe } from "@/service/auth/getMe";
import { gearForRental, getCustomerDashboardData } from "@/service/customer/customerService";
import { getGearById } from "@/service/gear/gearService";
import { getRentalById } from "@/service/rental/rentalService";
import type { Gear } from "@/types/gear";
import type { Payment } from "@/types/payment";
import type { Rental, RentalStatus } from "@/types/rental";
import { ArrowLeft, CalendarDays, CheckCircle2, CreditCard, PackageOpen, XCircle } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

const statusOrder: RentalStatus[] = ["PLACED", "CONFIRMED", "PAID", "PICKED_UP", "RETURNED"];
const statusLabels: Record<RentalStatus, string> = { PLACED: "Order placed", CONFIRMED: "Confirmed", PAID: "Payment received", PICKED_UP: "Picked up", RETURNED: "Returned", CANCELLED: "Cancelled" };

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 }).format(value);
}

function formatDate(value?: string) {
  if (!value) return "Date unavailable";
  const date = new Date(`${value.slice(0, 10)}T12:00:00`);
  return Number.isNaN(date.getTime()) ? "Date unavailable" : new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(date);
}

function gearName(gear: Gear | undefined, rental: Rental) {
  return gear?.name ?? `Gear #${rental.gearId}`;
}

function providerName(gear: Gear | undefined) {
  return gear?.provider?.name ?? "Provider details unavailable";
}

async function loadCustomerData() {
  try {
    return await getCustomerDashboardData();
  } catch {
    return null;
  }
}

export async function CustomerDashboardView() {
  const data = await loadCustomerData();
  if (!data) return <CustomerError />;
  const active = data.rentals.find((rental) => rental.status === "PICKED_UP");
  const upcoming = data.rentals.filter((rental) => ["PLACED", "CONFIRMED", "PAID"].includes(rental.status)).slice(0, 3);
  const stats = [
    { label: "Total rentals", value: data.rentals.length },
    { label: "Active rentals", value: data.rentals.filter((rental) => ["PAID", "PICKED_UP"].includes(rental.status)).length },
    { label: "Pending orders", value: data.rentals.filter((rental) => rental.status === "PLACED").length },
    { label: "Completed rentals", value: data.rentals.filter((rental) => rental.status === "RETURNED").length },
  ];

  return <CustomerShell title="Customer dashboard"><div className="flex flex-wrap items-start justify-between gap-4"><div><h1 className="gearup-h1">Your rentals</h1><p className="gearup-body mt-1.5">Here&apos;s what&apos;s happening with your gear.</p></div><Button asChild><Link href="/gear">Rent new gear</Link></Button></div><div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{stats.map((stat) => <div className="gearup-card p-5" key={stat.label}><p className="text-[13px] font-semibold text-muted-foreground">{stat.label}</p><p className="mt-2 text-[26px] font-extrabold tracking-[-0.02em]">{stat.value}</p></div>)}</div>{active ? <DashboardPanel className="mt-8 border-primary" title="Active rental" action={<StatusBadge status={active.status} />}><RentalSummary rental={active} gear={gearForRental(data.gear, active)} action={<Button variant="secondary" size="sm" asChild><Link href={`/dashboard/customer/orders/${active.id}`}>View order</Link></Button>} /></DashboardPanel> : null}<DashboardPanel className="mt-8" title="Upcoming rentals" action={<Button variant="link" size="sm" asChild><Link href="/dashboard/customer/orders">View all</Link></Button>}>{upcoming.length ? <div className="space-y-3">{upcoming.map((rental) => <RentalSummary key={rental.id} rental={rental} gear={gearForRental(data.gear, rental)} action={<OrderAction rental={rental} />} />)}</div> : <EmptyState title="No upcoming rentals" description="Your next rental will appear here once you place an order." action={<Button size="sm" asChild><Link href="/gear">Browse gear</Link></Button>} />}</DashboardPanel><DashboardPanel className="mt-8" title="Recent rentals" action={<Button variant="link" size="sm" asChild><Link href="/dashboard/customer/orders">View all</Link></Button>}><RentalTable rentals={data.rentals.slice(0, 5)} gear={data.gear} /></DashboardPanel></CustomerShell>;
}

export async function CustomerOrdersView() {
  const data = await loadCustomerData();
  if (!data) return <CustomerError />;
  return <CustomerShell title="My orders"><PageHeading title="My orders" description="Every rental you&apos;ve placed, tracked in one place." /><DashboardPanel className="mt-7"><RentalTable rentals={data.rentals} gear={data.gear} /></DashboardPanel></CustomerShell>;
}

export async function CustomerOrderDetailView({ id }: { id: string }) {
  const result = await loadOrder(id);
  if (result.kind === "missing") notFound();
  if (result.kind === "error") return <CustomerError />;
  const { rental, gear } = result;
  return <CustomerShell title="Order details"><Button variant="ghost" size="sm" className="mb-4 pl-0" asChild><Link href="/dashboard/customer/orders"><ArrowLeft />Back to orders</Link></Button><div className="flex flex-wrap items-start justify-between gap-3"><div><h1 className="gearup-h2">Order #{rental.id}</h1><p className="gearup-small mt-1">Rental dates and status</p></div><StatusBadge status={rental.status} /></div><div className="mt-6 grid items-start gap-6 lg:grid-cols-2"><DashboardPanel title="Order summary"><div className="flex items-start gap-3 border-b border-border pb-4"><div className="flex size-14 items-center justify-center rounded-md bg-secondary text-primary"><PackageOpen /></div><div><h2 className="font-bold">{gearName(gear, rental)}</h2><p className="gearup-small">{providerName(gear)}</p></div></div><DetailRow label="Rental dates" value={`${formatDate(rental.startDate)} – ${formatDate(rental.endDate)}`} /><DetailRow label="Amount" value={formatCurrency(rental.totalAmount)} strong />{rental.status === "CONFIRMED" ? <PaymentButton rentalId={rental.id} className="mt-5" /> : null}{rental.status === "RETURNED" && !rental.reviewed ? <ReviewForm rentalId={rental.id} /> : null}{rental.status === "RETURNED" && rental.reviewed ? <p className="mt-5 flex items-center gap-2 text-sm text-[#166534]"><CheckCircle2 className="size-4" />Review already submitted</p> : null}</DashboardPanel><DashboardPanel title="Order timeline"><Timeline status={rental.status} /></DashboardPanel></div></CustomerShell>;
}

export async function CustomerPayView({ id }: { id: string }) {
  const result = await loadOrder(id);
  if (result.kind === "missing") notFound();
  if (result.kind === "error") return <CustomerError />;
  return <CustomerShell title="Checkout"><Button variant="ghost" size="sm" className="mb-4 pl-0" asChild><Link href={`/dashboard/customer/orders/${id}`}><ArrowLeft />Back to order</Link></Button><PageHeading title="Checkout" description="Complete payment for your confirmed rental." /><div className="mt-6 grid items-start gap-6 lg:grid-cols-2"><DashboardPanel title="Payment"><p className="gearup-small">You&apos;ll be redirected to a secure checkout page to complete payment.</p><PaymentButton rentalId={result.rental.id} className="mt-5" /><p className="gearup-caption mt-4">GearUp does not store your payment details.</p></DashboardPanel><DashboardPanel title="Order summary"><DetailRow label="Gear" value={gearName(result.gear, result.rental)} /><DetailRow label="Provider" value={providerName(result.gear)} /><DetailRow label="Rental dates" value={`${formatDate(result.rental.startDate)} – ${formatDate(result.rental.endDate)}`} /><DetailRow label="Total" value={formatCurrency(result.rental.totalAmount)} strong /></DashboardPanel></div></CustomerShell>;
}

export async function CustomerPaymentsView() {
  const data = await loadCustomerData();
  if (!data) return <CustomerError />;
  return <CustomerShell title="Payment history"><PageHeading title="Payment history" description="Receipts and payment status for your rentals." /><DashboardPanel className="mt-7">{data.payments.length ? <div className="overflow-x-auto"><table className="gearup-table"><thead><tr><th>Order reference</th><th>Amount</th><th>Status</th><th>Date</th></tr></thead><tbody>{data.payments.map((payment) => <PaymentRow payment={payment} key={payment.id} />)}</tbody></table></div> : <EmptyState title="No payments yet" description="Payment records will appear here after you complete a rental checkout." action={<Button size="sm" asChild><Link href="/gear">Browse gear</Link></Button>} />}</DashboardPanel></CustomerShell>;
}

export async function CustomerReviewsView() {
  const data = await loadCustomerData();
  if (!data) return <CustomerError />;
  const eligible = data.rentals.filter((rental) => rental.status === "RETURNED" && !rental.reviewed);
  const reviewed = data.rentals.filter((rental) => rental.status === "RETURNED" && rental.reviewed);
  return <CustomerShell title="Reviews"><PageHeading title="Reviews" description="Share feedback on gear you&apos;ve returned." />{eligible.length ? <DashboardPanel className="mt-7" title="Awaiting your review"><div className="space-y-5">{eligible.map((rental) => <div key={rental.id}><RentalSummary rental={rental} gear={gearForRental(data.gear, rental)} /><ReviewForm rentalId={rental.id} /></div>)}</div></DashboardPanel> : null}<DashboardPanel className="mt-7" title="Your reviews">{reviewed.length ? <div className="space-y-3">{reviewed.map((rental) => <div className="flex items-center justify-between border-b border-border py-3 last:border-0" key={rental.id}><span className="font-semibold">{gearName(gearForRental(data.gear, rental), rental)}</span><span className="flex items-center gap-1 text-sm text-[#166534]"><CheckCircle2 className="size-4" />Submitted</span></div>)}</div> : <EmptyState title="No reviews yet" description="Reviews become available after you return a rental." />}</DashboardPanel></CustomerShell>;
}

export async function CustomerProfileView() {
  const user = await getMe();
  if (!user.success || !user.data?.profile) return <CustomerError title="We could not load your profile" />;
  const profile = user.data.profile;
  return <CustomerShell title="Profile"><PageHeading title="Profile" description="Your account details." /><DashboardPanel className="mt-7 max-w-2xl"><div className="flex items-center gap-3 border-b border-border pb-5"><span className="flex size-14 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">{profile.name.split(" ").map((part) => part[0]).slice(0, 2).join("").toUpperCase()}</span><div><h2 className="font-bold">{profile.name}</h2><p className="gearup-small">Customer account</p></div></div><DetailRow label="Name" value={profile.name} /><DetailRow label="Email" value={profile.email} /><DetailRow label="Account status" value={profile.activeStatus} /></DashboardPanel></CustomerShell>;
}

function CustomerShell({ title, children }: { title: string; children: React.ReactNode }) {
  return <ProtectedDashboardShell role="Customer"><PageContainer><div className="sr-only">{title}</div>{children}</PageContainer></ProtectedDashboardShell>;
}

function PageHeading({ title, description }: { title: string; description: string }) {
  return <div><h1 className="gearup-h1">{title}</h1><p className="gearup-body mt-1.5">{description}</p></div>;
}

function CustomerError({ title = "We could not load your rentals" }: { title?: string }) {
  return <PageContainer className="py-12"><ErrorState title={title} description="Please try again shortly. If the problem continues, check your connection." /></PageContainer>;
}

function RentalSummary({ rental, gear, action }: { rental: Rental; gear?: Gear; action?: React.ReactNode }) {
  return <div className="flex flex-wrap items-center gap-3 border-b border-border py-3 last:border-0"><div className="flex size-14 items-center justify-center rounded-md bg-secondary text-primary"><PackageOpen /></div><div className="min-w-[180px] flex-1"><p className="font-semibold">{gearName(gear, rental)}</p><p className="gearup-small">{providerName(gear)}</p><p className="gearup-caption mt-1 flex items-center gap-1"><CalendarDays className="size-3.5" />{formatDate(rental.startDate)} – {formatDate(rental.endDate)}</p></div><div className="flex items-center gap-3"><StatusBadge status={rental.status} />{action}</div></div>;
}

function RentalTable({ rentals, gear }: { rentals: Rental[]; gear: Gear[] }) {
  if (!rentals.length) return <EmptyState title="No rentals yet" description="Once you rent gear, your rental history will show up here." action={<Button size="sm" asChild><Link href="/gear">Browse gear</Link></Button>} />;
  return <div className="overflow-x-auto"><table className="gearup-table"><thead><tr><th>Order</th><th>Gear</th><th>Provider</th><th>Rental dates</th><th>Amount</th><th>Status</th><th>Action</th></tr></thead><tbody>{rentals.map((rental) => <tr key={rental.id}><td className="font-semibold">#{rental.id}</td><td>{gearName(gearForRental(gear, rental), rental)}</td><td>{providerName(gearForRental(gear, rental))}</td><td>{formatDate(rental.startDate)} – {formatDate(rental.endDate)}</td><td className="font-semibold">{formatCurrency(rental.totalAmount)}</td><td><StatusBadge status={rental.status} /></td><td><OrderAction rental={rental} /></td></tr>)}</tbody></table></div>;
}

function OrderAction({ rental }: { rental: Rental }) {
  if (rental.status === "CONFIRMED") return <PaymentButton rentalId={rental.id} />;
  if (rental.status === "PLACED") return <span className="text-xs text-muted-foreground">Pending</span>;
  if (rental.status === "PICKED_UP") return <span className="text-xs font-semibold text-[#166534]">Active rental</span>;
  if (rental.status === "RETURNED" && !rental.reviewed) return <Button variant="secondary" size="sm" asChild><Link href={`/dashboard/customer/orders/${rental.id}`}>Leave review</Link></Button>;
  if (rental.status === "CANCELLED") return <span className="text-xs text-muted-foreground">Cancelled</span>;
  return <Button variant="outline" size="sm" asChild><Link href={`/dashboard/customer/orders/${rental.id}`}>View</Link></Button>;
}

function Timeline({ status }: { status: RentalStatus }) {
  if (status === "CANCELLED") return <p className="flex items-center gap-2 text-sm text-muted-foreground"><XCircle className="size-4 text-destructive" />This order was cancelled.</p>;
  const currentIndex = statusOrder.indexOf(status);
  return <div className="space-y-0">{statusOrder.map((item, index) => <div className="flex gap-3" key={item}><div className="flex flex-col items-center"><span className={`mt-1.5 size-3 shrink-0 rounded-full ${index <= currentIndex ? "bg-primary" : "bg-border"}`} />{index < statusOrder.length - 1 ? <span className={`min-h-8 w-0.5 flex-1 ${index < currentIndex ? "bg-primary" : "bg-border"}`} /> : null}</div><div className={`pb-5 text-sm ${index <= currentIndex ? "font-semibold" : "text-muted-foreground"}`}>{statusLabels[item]}{index === currentIndex ? <span className="ml-2 text-xs font-normal text-muted-foreground">Current</span> : null}</div></div>)}</div>;
}

function DetailRow({ label, value, strong = false }: { label: string; value: string; strong?: boolean }) {
  return <div className={`flex justify-between gap-4 border-b border-border py-3 text-sm last:border-0 ${strong ? "font-bold" : ""}`}><span className={strong ? "text-foreground" : "text-muted-foreground"}>{label}</span><span className="text-right">{value}</span></div>;
}

function PaymentRow({ payment }: { payment: Payment }) {
  const tone = payment.status === "PAID" ? "active" : payment.status === "CANCELLED" || payment.status === "FAILED" ? "cancelled" : "placed";
  return <tr><td className="font-semibold">#{payment.rentalId}</td><td>{formatCurrency(payment.amount)}</td><td><span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold ${tone === "active" ? "bg-[#dcfce7] text-[#166534]" : tone === "cancelled" ? "bg-[#fee2e2] text-[#991b1b]" : "bg-[#fef3c7] text-[#92400e]"}`}><CreditCard className="size-3.5" />{payment.status}</span></td><td>{formatDate(payment.createdAt)}</td></tr>;
}

async function loadOrder(id: string) {
  try {
    const response = await getRentalById(id);
    if (!response.success || !response.data) return { kind: "missing" as const };
    let gear: Gear | undefined;
    try {
      const gearResponse = await getGearById(response.data.gearId);
      gear = gearResponse.success ? gearResponse.data : undefined;
    } catch {
      gear = undefined;
    }
    return { kind: "success" as const, rental: response.data, gear };
  } catch (error) {
    if (error instanceof Error && "status" in error && (error as Error & { status?: number }).status === 404) return { kind: "missing" as const };
    return { kind: "error" as const };
  }
}
