import { redirect } from "next/navigation";

export default async function TalentSwipePage({
  searchParams,
}: {
  searchParams: { slug?: string };
}) {
  const resolvedParams = await searchParams;
  const slug = resolvedParams.slug;
  
  if (slug) {
    redirect(`/talents`); // In the new architecture, swipe is on the main page
  }
  
  redirect("/talents");
}
