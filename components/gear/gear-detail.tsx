"use client";

import { Badge, EmptyState, PageContainer, ResponsiveGrid } from "@/components/ui/gearup";
import { Button } from "@/components/ui/button";
import type { Gear } from "@/types/gear";
import { rentalPricing } from "@/lib/rental-pricing";
import { ArrowLeft, ChevronLeft, ChevronRight, ImageOff, MapPin, Package, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { GearCard } from "@/components/gear/gear-card";

const tabItems = ["description", "specifications", "provider", "reviews"] as const;
type DetailTab = (typeof tabItems)[number];

const monthFormatter = new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" });

function todayIso() {
  const date = new Date();
  return formatIsoDate(date);
}

function formatIsoDate(date: Date) {
  return [date.getFullYear(), String(date.getMonth() + 1).padStart(2, "0"), String(date.getDate()).padStart(2, "0")].join("-");
}

function parseIsoDate(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day, 12);
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 }).format(value);
}

function initials(value: string) {
  return value.split(" ").map((part) => part[0]).slice(0, 2).join("").toUpperCase();
}

export function GearDetail({ gear, relatedGear }: { gear: Gear; relatedGear: Gear[] }) {
  const router = useRouter();
  const images = gear.images ?? [];
  const [activeImage, setActiveImage] = useState(0);
  const [activeTab, setActiveTab] = useState<DetailTab>("description");
  const [pickupDate, setPickupDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [calendarMonth, setCalendarMonth] = useState(() => new Date(new Date().getFullYear(), new Date().getMonth(), 1));
  const [dateError, setDateError] = useState("");
  const today = todayIso();
  const available = gear.available && gear.stock > 0;
  const pricing = pickupDate && returnDate ? rentalPricing(gear.pricePerDay, pickupDate, returnDate) : { days: 0, subtotal: 0, serviceFee: 0, total: 0 };
  const validDates = available && Boolean(pickupDate && returnDate) && pricing.days > 0 && !dateError;
  const providerName = gear.provider?.name ?? "Provider information unavailable";
  const calendarCells = useMemo(() => getCalendarCells(calendarMonth), [calendarMonth]);

  const selectDate = (value: string) => {
    if (!available || value < today) return;
    if (!pickupDate || returnDate) {
      setPickupDate(value);
      setReturnDate("");
      setDateError("");
      return;
    }
    if (value <= pickupDate) {
      setDateError("Return date must be after pickup date.");
      return;
    }
    setReturnDate(value);
    setDateError("");
  };

  const selectPickupDate = (value: string) => {
    if (value < today) return;
    setPickupDate(value);
    if (returnDate && returnDate <= value) setReturnDate("");
    setDateError("");
  };

  const selectReturnDate = (value: string) => {
    if (!pickupDate || value <= pickupDate) {
      setDateError("Return date must be after pickup date.");
      return;
    }
    setReturnDate(value);
    setDateError("");
  };

  const rentNow = () => {
    if (!validDates) return;
    const params = new URLSearchParams({ gearId: String(gear.id), startDate: pickupDate, endDate: returnDate });
    router.push(`/customer/orders?${params.toString()}`);
  };

  return (
    <div className="py-10 sm:py-16">
      <PageContainer>
        <Button variant="ghost" size="sm" className="mb-4 pl-0" asChild><Link href="/gear"><ArrowLeft />Back to browse</Link></Button>
        <div className="grid items-start gap-10 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <Gallery images={images} activeImage={activeImage} name={gear.name} category={gear.category} onSelect={setActiveImage} />
            <div className="mt-11 flex gap-1 border-b border-border" role="tablist" aria-label="Gear details">
              {tabItems.map((tab) => <button key={tab} role="tab" aria-selected={activeTab === tab} onClick={() => setActiveTab(tab)} className={`border-b-2 px-4 py-3 text-sm font-semibold capitalize transition-colors ${activeTab === tab ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}>{tab}</button>)}
            </div>
            <TabContent tab={activeTab} gear={gear} providerName={providerName} />
            {relatedGear.length > 0 ? <section className="mt-14"><h2 className="gearup-h3 mb-4">You might also like</h2><ResponsiveGrid columns={3}>{relatedGear.map((item) => <GearCard gear={item} key={item.id} />)}</ResponsiveGrid></section> : null}
          </div>
          <RentalCard gear={gear} providerName={providerName} pickupDate={pickupDate} returnDate={returnDate} today={today} calendarMonth={calendarMonth} calendarCells={calendarCells} pricing={pricing} dateError={dateError} available={available} onMonthChange={setCalendarMonth} onSelectDate={selectDate} onPickupChange={selectPickupDate} onReturnChange={selectReturnDate} onRent={rentNow} validDates={validDates} />
        </div>
      </PageContainer>
    </div>
  );
}

function Gallery({ images, activeImage, name, category, onSelect }: { images: string[]; activeImage: number; name: string; category: string; onSelect: (index: number) => void }) {
  const image = images[activeImage];
  const [failedImages, setFailedImages] = useState<Record<number, boolean>>({});
  const hasImage = Boolean(image) && !failedImages[activeImage];
  return <div><div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-xl bg-secondary text-primary">{hasImage ? <Image src={image} alt={name} fill unoptimized className="object-cover" onError={() => setFailedImages((current) => ({ ...current, [activeImage]: true }))} /> : <FallbackImage category={category} />}</div>{images.length > 0 ? <div className="mt-3 flex gap-2.5 overflow-x-auto">{images.map((thumbnail, index) => <button key={`${thumbnail}-${index}`} onClick={() => onSelect(index)} className={`relative size-16 shrink-0 overflow-hidden rounded-md border-2 bg-secondary ${activeImage === index ? "border-primary" : "border-transparent"}`} aria-label={`View image ${index + 1}`}><Image src={thumbnail} alt="" fill unoptimized className="object-cover" onError={() => setFailedImages((current) => ({ ...current, [index]: true }))} /></button>)}</div> : null}</div>;
}

function FallbackImage({ category }: { category: string }) {
  return <div className="flex flex-col items-center gap-2 text-primary"><Package className="size-16 opacity-60" /><span className="text-sm font-semibold opacity-75">{category}</span><span className="flex items-center gap-1 text-xs text-muted-foreground"><ImageOff className="size-3.5" />Image unavailable</span></div>;
}

function TabContent({ tab, gear, providerName }: { tab: DetailTab; gear: Gear; providerName: string }) {
  if (tab === "description") return <div className="pt-6"><p className="gearup-body">{gear.description || "No description has been provided for this gear yet."}</p></div>;
  if (tab === "specifications") return <div className="grid gap-x-8 pt-6 sm:grid-cols-2"><SpecRow label="Category" value={gear.category} /><SpecRow label="Brand" value={gear.brand || "Not provided"} /><SpecRow label="Price per day" value={formatCurrency(gear.pricePerDay)} /><SpecRow label="Stock" value={String(gear.stock)} /><SpecRow label="Availability" value={gear.available && gear.stock > 0 ? "Available" : "Unavailable"} /><SpecRow label="Provider" value={providerName} /></div>;
  if (tab === "provider") return <div className="pt-6"><ProviderInfo gear={gear} providerName={providerName} /></div>;
  return <div className="pt-6"><EmptyState title="No reviews yet" description="Reviews will appear here after renters share their experience with this gear." /></div>;
}

function SpecRow({ label, value }: { label: string; value: string }) {
  return <div className="flex justify-between gap-4 border-b border-dashed border-border py-2.5 text-sm"><span className="text-muted-foreground">{label}</span><span className="text-right font-semibold">{value}</span></div>;
}

function ProviderInfo({ gear, providerName }: { gear: Gear; providerName: string }) {
  return <><div className="flex items-center gap-3.5"><span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-foreground text-sm font-bold text-background">{initials(providerName)}</span><div><strong className="block">{providerName}</strong>{gear.provider?.location ? <span className="gearup-small flex items-center gap-1"><MapPin className="size-3.5" />{gear.provider.location}</span> : <span className="gearup-small">Location not provided</span>}</div></div><p className="gearup-body mt-4">Provider details and rental history are supplied by GearUp when available.</p></>;
}

function RentalCard({ gear, providerName, pickupDate, returnDate, today, calendarMonth, calendarCells, pricing, dateError, available, onMonthChange, onSelectDate, onPickupChange, onReturnChange, onRent, validDates }: { gear: Gear; providerName: string; pickupDate: string; returnDate: string; today: string; calendarMonth: Date; calendarCells: Array<string | null>; pricing: { days: number; subtotal: number; serviceFee: number; total: number }; dateError: string; available: boolean; onMonthChange: (date: Date) => void; onSelectDate: (date: string) => void; onPickupChange: (date: string) => void; onReturnChange: (date: string) => void; onRent: () => void; validDates: boolean }) {
  return <aside className="rounded-xl border border-border bg-card p-5 shadow-[var(--shadow-card)] sm:p-6 lg:sticky lg:top-[88px]"><span className="text-xs font-semibold text-muted-foreground">{gear.category}{gear.brand ? ` · ${gear.brand}` : ""}</span><h1 className="gearup-h3 mt-1">{gear.name}</h1><div className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground">{gear.provider?.rating != null ? <><Star className="size-4 fill-[#f59e0b] text-[#f59e0b]" /><strong className="text-foreground">{gear.provider.rating.toFixed(1)}</strong></> : <span>Rating unavailable</span>}<span>·</span><span>Review count unavailable</span></div><div className="mt-2 flex items-baseline gap-1"><strong className="text-[28px] tracking-[-0.02em]">{formatCurrency(gear.pricePerDay)}</strong><span className="gearup-small">/ day</span></div><div className="mt-2"><Badge tone={available ? "available" : "unavailable"}>{available ? "Available" : "Unavailable"}</Badge></div><div className="my-4 flex items-center gap-2.5 border-y border-border py-3.5"><span className="flex size-8 items-center justify-center rounded-full bg-foreground text-[11px] font-bold text-background">{initials(providerName)}</span><div><strong className="block text-[13px]">{providerName}</strong><span className="gearup-caption">{gear.provider?.location ?? "Location not provided"}</span></div></div>{available ? <><p className="mb-2 text-sm font-semibold">Select rental dates</p><div className="grid grid-cols-2 gap-2"><label className="text-xs font-semibold text-muted-foreground">Pickup<input type="date" value={pickupDate} min={today} onChange={(event) => onPickupChange(event.target.value)} className="mt-1 h-10 w-full rounded-md border border-input bg-card px-2 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-secondary" /></label><label className="text-xs font-semibold text-muted-foreground">Return<input type="date" value={returnDate} min={pickupDate || today} onChange={(event) => onReturnChange(event.target.value)} className="mt-1 h-10 w-full rounded-md border border-input bg-card px-2 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-secondary" /></label></div><Calendar month={calendarMonth} cells={calendarCells} today={today} pickupDate={pickupDate} returnDate={returnDate} onMonthChange={onMonthChange} onSelectDate={onSelectDate} /><p className="gearup-caption">Select a pickup date, then a return date. Past dates are unavailable.</p>{dateError ? <p className="mt-2 text-xs text-destructive">{dateError}</p> : null}<div className="mt-3.5 border-t border-border pt-3.5 text-sm"><PriceRow label={`${formatCurrency(gear.pricePerDay)} × ${pricing.days} day${pricing.days === 1 ? "" : "s"}`} value={formatCurrency(pricing.subtotal)} /><PriceRow label="Service fee" value={formatCurrency(pricing.serviceFee)} /><PriceRow label="Total" value={formatCurrency(pricing.total)} total /></div><Button size="lg" className="mt-3.5 w-full" disabled={!validDates} onClick={onRent}>Rent now</Button><p className="gearup-caption mt-2.5 text-center">You will not be charged yet</p></> : <div className="py-5"><EmptyState title="Currently unavailable" description="This item is fully booked right now. Check back soon or explore similar gear below." /></div>}</aside>;
}

function PriceRow({ label, value, total = false }: { label: string; value: string; total?: boolean }) {
  return <div className={`flex justify-between gap-4 py-1.5 ${total ? "mt-1 border-t border-border pt-2.5 text-base font-bold text-foreground" : "text-muted-foreground"}`}><span>{label}</span><span>{value}</span></div>;
}

function Calendar({ month, cells, today, pickupDate, returnDate, onMonthChange, onSelectDate }: { month: Date; cells: Array<string | null>; today: string; pickupDate: string; returnDate: string; onMonthChange: (date: Date) => void; onSelectDate: (date: string) => void }) {
  const currentMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  const canGoPrevious = month > currentMonth;
  return <div className="my-3.5 rounded-md border border-border p-3.5"><div className="mb-2.5 flex items-center justify-between text-[13px] font-bold"><Button variant="ghost" size="icon-xs" aria-label="Previous month" disabled={!canGoPrevious} onClick={() => onMonthChange(new Date(month.getFullYear(), month.getMonth() - 1, 1))}><ChevronLeft /></Button><span>{monthFormatter.format(month)}</span><Button variant="ghost" size="icon-xs" aria-label="Next month" onClick={() => onMonthChange(new Date(month.getFullYear(), month.getMonth() + 1, 1))}><ChevronRight /></Button></div><div className="grid grid-cols-7 gap-1 text-center"><>{["S", "M", "T", "W", "T", "F", "S"].map((day, index) => <span key={`${day}-${index}`} className="pb-1 text-[11px] font-semibold text-muted-foreground">{day}</span>)}{cells.map((value, index) => value ? <CalendarDay key={value} value={value} today={today} pickupDate={pickupDate} returnDate={returnDate} onSelect={onSelectDate} /> : <span key={`empty-${index}`} />)}</></div></div>;
}

function CalendarDay({ value, today, pickupDate, returnDate, onSelect }: { value: string; today: string; pickupDate: string; returnDate: string; onSelect: (date: string) => void }) {
  const past = value < today;
  const selected = value === pickupDate || value === returnDate;
  const inRange = Boolean(pickupDate && returnDate && value > pickupDate && value < returnDate);
  return <button type="button" disabled={past} onClick={() => onSelect(value)} className={`rounded-sm py-1.5 text-[13px] ${past ? "cursor-not-allowed text-slate-300 line-through" : selected ? "bg-primary font-bold text-primary-foreground" : inRange ? "bg-secondary text-secondary-foreground" : "hover:bg-muted"}`}>{parseIsoDate(value).getDate()}</button>;
}

function getCalendarCells(month: Date) {
  const cells: Array<string | null> = Array(new Date(month.getFullYear(), month.getMonth(), 1).getDay()).fill(null);
  const days = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  for (let day = 1; day <= days; day += 1) cells.push(formatIsoDate(new Date(month.getFullYear(), month.getMonth(), day)));
  return cells;
}
