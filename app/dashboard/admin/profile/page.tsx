import { ProfileView } from "@/components/profile-view";

export default function AdminProfilePage() {
  return <ProfileView note="Profile editing isn't available yet — the GearUp API doesn't expose an update-profile endpoint for admins." />;
}
