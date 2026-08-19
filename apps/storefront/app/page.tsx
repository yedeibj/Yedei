import { createClient as createServerSupabaseClient } from "@yedei/database/server";
import Header from "@/components/Header";
import HeroSlider from "@/components/HeroSlider";
import CategoryGrid from "@/components/CategoryGrid";
import NewArrivals from "@/components/NewArrivals";
import BestSellers from "@/components/BestSellers";
import SeasonalBanner from "@/components/SeasonalBanner";
import SectionIntro from "@/components/SectionIntro";
import CategoryProducts from "@/components/CategoryProducts";
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
      <NewArrivals />
      <BestSellers />
      <SeasonalBanner />

      <SectionIntro
        title="Explorez chaque collection"
        description="Des tenues pensées pour chaque membre de la famille, du premier âge à l'âge adulte."
      />
      <CategoryProducts
        categorySlug="homme"
        title="Collection Homme"
        subtitle="Chemises, pantalons et pièces intemporelles"
      />
      <CategoryProducts
        categorySlug="femme"
        title="Collection Femme"
        subtitle="Robes, ensembles et essentiels du quotidien"
      />
      <CategoryProducts
        categorySlug="enfant"
        title="Collection Enfant"
        subtitle="Tenues robustes et élégantes pour grandir"
      />
      <CategoryProducts
        categorySlug="bebe"
        title="Collection Bébé"
        subtitle="Douceur et confort dès les premiers jours"
      />

      <BrandStory />
      <Footer />
    </main>
  );
}
