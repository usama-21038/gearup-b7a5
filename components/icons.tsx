import type { ReactElement, SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function base(size = 16) {
  return { width: size, height: size, className: "svg-icon" };
}

export function BikeIcon(p: IconProps) {
  return (
    <svg {...base(p.size)} {...p} viewBox="0 0 64 64">
      <circle cx="16" cy="46" r="11" />
      <circle cx="48" cy="46" r="11" />
      <path d="M16 46 26 22h14l8 24" />
      <path d="M26 22l10 14h12" />
      <path d="M22 22h8" />
      <path d="M36 46h12" />
    </svg>
  );
}
export function TentIcon(p: IconProps) {
  return (
    <svg {...base(p.size)} {...p} viewBox="0 0 64 64">
      <path d="M6 48 32 12l26 36" />
      <path d="M20 48 32 26l12 22" />
      <path d="M6 48h52" />
      <path d="M27 48v-8l5-6 5 6v8" />
    </svg>
  );
}
export function BallIcon(p: IconProps) {
  return (
    <svg {...base(p.size)} {...p} viewBox="0 0 64 64">
      <circle cx="32" cy="32" r="22" />
      <path d="M32 16v32M18 22l28 20M46 22 18 42" />
      <circle cx="32" cy="32" r="6" />
    </svg>
  );
}
export function BackpackIcon(p: IconProps) {
  return (
    <svg {...base(p.size)} {...p} viewBox="0 0 64 64">
      <path d="M20 26v-6a12 12 0 0 1 24 0v6" />
      <rect x="14" y="26" width="36" height="30" rx="6" />
      <path d="M22 26h20" />
      <rect x="25" y="34" width="14" height="10" rx="2" />
      <path d="M20 12v8M44 12v8" />
    </svg>
  );
}
export function RacketIcon(p: IconProps) {
  return (
    <svg {...base(p.size)} {...p} viewBox="0 0 64 64">
      <ellipse cx="30" cy="22" rx="16" ry="18" />
      <path d="M30 4v36M18 12l24 20M42 12 18 32M22 6l16 32M22 38l16-32" />
      <path d="M30 40l14 22" />
    </svg>
  );
}
export function KayakIcon(p: IconProps) {
  return (
    <svg {...base(p.size)} {...p} viewBox="0 0 64 64">
      <ellipse cx="32" cy="32" rx="28" ry="9" />
      <path d="M8 32h48" />
      <path d="M4 16l16 20L4 48M60 16 44 36l16 12" />
    </svg>
  );
}
export function DumbbellIcon(p: IconProps) {
  return (
    <svg {...base(p.size)} {...p} viewBox="0 0 64 64">
      <rect x="4" y="26" width="8" height="12" rx="2" />
      <rect x="52" y="26" width="8" height="12" rx="2" />
      <rect x="14" y="20" width="6" height="24" rx="2" />
      <rect x="44" y="20" width="6" height="24" rx="2" />
      <path d="M20 32h24" />
    </svg>
  );
}
export function BoxIcon(p: IconProps) {
  return (
    <svg {...base(p.size)} {...p} viewBox="0 0 24 24">
      <path d="m21 8-9-5-9 5 9 5 9-5Z" />
      <path d="M3 8v9l9 5 9-5V8M12 13v9" />
    </svg>
  );
}
export function StarIcon({ size = 14, ...p }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="currentColor" {...p}>
      <path d="M10 1.5l2.6 5.6 6.1.6-4.6 4.1 1.3 6-5.4-3.1-5.4 3.1 1.3-6L1.3 7.7l6.1-.6z" />
    </svg>
  );
}
export function SearchIcon(p: IconProps) {
  return (
    <svg {...base(p.size ?? 18)} {...p} viewBox="0 0 24 24">
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4.3-4.3" />
    </svg>
  );
}
export function FilterIcon(p: IconProps) {
  return (
    <svg {...base(p.size)} {...p} viewBox="0 0 24 24">
      <path d="M4 6h16M7 12h10M10 18h4" />
    </svg>
  );
}
export function XIcon(p: IconProps) {
  return (
    <svg {...base(p.size)} {...p} viewBox="0 0 24 24">
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}
export function CheckIcon(p: IconProps) {
  return (
    <svg {...base(p.size)} {...p} viewBox="0 0 24 24" strokeWidth={2.4}>
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}
export function CheckCircleIcon({ size = 18, ...p }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} {...p}>
      <circle cx="12" cy="12" r="10" />
      <path d="m9 12 2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
export function AlertCircleIcon({ size = 18, ...p }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} {...p}>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 8v5M12 16h.01" strokeLinecap="round" />
    </svg>
  );
}
export function XCircleIcon({ size = 30, ...p }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} {...p}>
      <circle cx="12" cy="12" r="10" />
      <path d="m15 9-6 6M9 9l6 6" strokeLinecap="round" />
    </svg>
  );
}
export function ChevronLeftIcon(p: IconProps) {
  return (
    <svg {...base(p.size)} {...p} viewBox="0 0 24 24" strokeWidth={2.4}>
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}
export function ChevronRightIcon(p: IconProps) {
  return (
    <svg {...base(p.size)} {...p} viewBox="0 0 24 24" strokeWidth={2.4}>
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}
export function MenuIcon(p: IconProps) {
  return (
    <svg {...base(p.size ?? 18)} {...p} viewBox="0 0 24 24" strokeWidth={2.2}>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}
export function LogoutIcon(p: IconProps) {
  return (
    <svg {...base(p.size)} {...p} viewBox="0 0 24 24">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <path d="M16 17l5-5-5-5M21 12H9" />
    </svg>
  );
}
export function HomeIcon(p: IconProps) {
  return (
    <svg {...base(p.size)} {...p} viewBox="0 0 24 24">
      <path d="m3 11 9-8 9 8" />
      <path d="M5 10v10h14V10" />
    </svg>
  );
}
export function OrdersIcon(p: IconProps) {
  return (
    <svg {...base(p.size)} {...p} viewBox="0 0 24 24">
      <rect x="4" y="4" width="16" height="17" rx="2" />
      <path d="M8 9h8M8 13h8M8 17h5" />
    </svg>
  );
}
export function WalletIcon(p: IconProps) {
  return (
    <svg {...base(p.size)} {...p} viewBox="0 0 24 24">
      <rect x="3" y="6" width="18" height="14" rx="2" />
      <path d="M3 10h18" />
      <circle cx="16" cy="15" r="1.4" fill="currentColor" stroke="none" />
    </svg>
  );
}
export function ReviewIcon(p: IconProps) {
  return (
    <svg {...base(p.size)} {...p} viewBox="0 0 24 24">
      <path d="M21 11.5a8.4 8.4 0 0 1-8.9 8.4 8.6 8.6 0 0 1-4-1L3 20l1.2-4.9A8.4 8.4 0 1 1 21 11.5Z" />
    </svg>
  );
}
export function UserIcon(p: IconProps) {
  return (
    <svg {...base(p.size)} {...p} viewBox="0 0 24 24">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c1.5-4 5-6 8-6s6.5 2 8 6" />
    </svg>
  );
}
export function PlusIcon(p: IconProps) {
  return (
    <svg {...base(p.size)} {...p} viewBox="0 0 24 24" strokeWidth={2.4}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}
export function EditIcon({ size = 15, ...p }: IconProps) {
  return (
    <svg width={size} height={size} className="svg-icon" viewBox="0 0 24 24" {...p}>
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
    </svg>
  );
}
export function TrashIcon({ size = 15, ...p }: IconProps) {
  return (
    <svg width={size} height={size} className="svg-icon" viewBox="0 0 24 24" {...p}>
      <path d="M3 6h18" />
      <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
    </svg>
  );
}
export function UsersIcon(p: IconProps) {
  return (
    <svg {...base(p.size)} {...p} viewBox="0 0 24 24">
      <circle cx="9" cy="8" r="4" />
      <path d="M2 21c1.2-3.6 4-5.5 7-5.5s5.8 1.9 7 5.5" />
      <circle cx="18" cy="9" r="3" />
      <path d="M16 15.2c2.4.4 4.3 2 5 5.8" />
    </svg>
  );
}
export function ShieldIcon(p: IconProps) {
  return (
    <svg {...base(p.size)} {...p} viewBox="0 0 24 24">
      <path d="M12 3 4 6v6c0 5 3.4 8.5 8 9 4.6-.5 8-4 8-9V6l-8-3Z" />
    </svg>
  );
}
export function GaugeIcon(p: IconProps) {
  return (
    <svg {...base(p.size)} {...p} viewBox="0 0 24 24">
      <path d="M4 15a8 8 0 1 1 16 0" />
      <path d="M12 15 16 9" />
      <path d="M4 19h16" />
    </svg>
  );
}
export function MapPinIcon({ size = 14, ...p }: IconProps) {
  return (
    <svg width={size} height={size} className="svg-icon" viewBox="0 0 24 24" {...p}>
      <path d="M12 22s7-6.5 7-12a7 7 0 1 0-14 0c0 5.5 7 12 7 12Z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}
export function CardIcon(p: IconProps) {
  return (
    <svg {...base(p.size ?? 18)} {...p} viewBox="0 0 24 24">
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <path d="M2 10h20" />
    </svg>
  );
}
export function ExtIcon({ size = 14, ...p }: IconProps) {
  return (
    <svg width={size} height={size} className="svg-icon" viewBox="0 0 24 24" {...p}>
      <path d="M14 4h6v6M20 4 10 14M6 4H5a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-1" />
    </svg>
  );
}
export function ArrowLeftIcon(p: IconProps) {
  return (
    <svg {...base(p.size)} {...p} viewBox="0 0 24 24" strokeWidth={2.4}>
      <path d="M19 12H5M12 19l-7-7 7-7" />
    </svg>
  );
}
export function MountainIcon(p: IconProps) {
  return (
    <svg width={p.size ?? 16} height={p.size ?? 16} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="m8 21 4-13 4 13" />
      <path d="M3 21 9 8l3 5" />
    </svg>
  );
}

const CATEGORY_ICON_MAP: Record<string, (p: IconProps) => ReactElement> = {
  cycling: BikeIcon,
  camping: TentIcon,
  "team sports": BallIcon,
  hiking: BackpackIcon,
  fitness: DumbbellIcon,
  "water sports": KayakIcon,
  tennis: RacketIcon,
};

export function CategoryIcon({ category, ...p }: IconProps & { category: string }) {
  const Icon = CATEGORY_ICON_MAP[category.trim().toLowerCase()] || BoxIcon;
  return <Icon {...p} />;
}

export function categoryTintClass(category: string): string {
  const key = category.trim().toLowerCase().replace(/\s+/g, "-");
  const known = ["cycling", "camping", "hiking", "water-sports", "team-sports", "fitness"];
  return known.includes(key) ? `tint-${key}` : "tint-default";
}
