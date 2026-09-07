import { AppShell } from "@/components/shared/app-shell";
import { getMe } from "@/service/auth/getMe";

const PublicGroupLayout = async (
    {
        children
    } : {
        children: React.ReactNode
    }
) => {
    const user = await getMe();
  return <AppShell user={user}>{children}</AppShell>
}

export default PublicGroupLayout