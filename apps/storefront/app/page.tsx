import { createClient as createServerSupabaseClient } from "@yedei/database/server";
import Header from "@/components/Header";
import HeroSlider from "@/components/HeroSlider";
import CategoryGrid from "@/components/CategoryGrid";
import CategoryProducts from "@/components/CategoryProducts";
import NewArrivals from "@/components/NewArrivals";
import BestSellers from "@/components/BestSellers";
import BrandStory from "@/components/BrandStory";
import Footer from "@/components/Footer";

export default async function HomePage() {
  const supabase = await createServerSupabaseClient();
  const { data: slides } = await supabase
    .from("hero_slides")
    .select("id, eyebrow, title, description, cta_label, cta_href, image_url")
    .eq("is_active", true)
    .order("sort_order");

  return (
    <main>
      <Header />
      <HeroSlider slides={slides ?? []} />
      <CategoryGrid />
      <CategoryProducts categorySlug="homme" title="Collection Homme" />
      <CategoryProducts categorySlug="femme" title="Collection Femme" />
      <CategoryProducts categorySlug="enfant" title="Collection Enfant" />
      <CategoryProducts categorySlug="bebe" title="Collection Bébé" />
      <NewArrivals />
      <BestSellers />
      <BrandStory />
      <Footer />
    </main>
  );
}
