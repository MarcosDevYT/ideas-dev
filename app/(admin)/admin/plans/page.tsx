import { getDbPlansAction } from "@/actions/plans/plan-actions";
import { PlansPageClient } from "@/components/layout/admin/PlansPageClient";

export const metadata = {
  title: "Planes — Admin IdeasDev",
};

export default async function AdminPlansPage(props: {
  searchParams?: Promise<{ env?: string }>;
}) {
  const searchParams = await props.searchParams;
  const envFilter = searchParams?.env || "all";

  const result = await getDbPlansAction();

  let subscriptions = result.success ? result.subscriptions || [] : [];
  let creditPackages = result.success ? result.creditPackages || [] : [];

  if (envFilter !== "all") {
    subscriptions = subscriptions.filter((s) => s.polarEnvironment === envFilter);
    creditPackages = creditPackages.filter((p) => p.polarEnvironment === envFilter);
  }

  return (
    <PlansPageClient 
      subscriptions={subscriptions} 
      creditPackages={creditPackages} 
    />
  );
}
