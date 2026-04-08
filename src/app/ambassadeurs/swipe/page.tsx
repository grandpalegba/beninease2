import { redirect } from "next/navigation";

export default async function AmbassadeurSwipePage({
  searchParams,
}: {
  searchParams: { slug?: string };
}) {
  const resolvedParams = await searchParams;
  const slug = resolvedParams.slug;
  
  if (slug) {
    redirect(`/ambassadeurs`); // In the new architecture, swipe is on the main page
  }
  
  redirect("/ambassadeurs");
}
