import Header from "@/components/Header";
import HeroSlider from "@/components/HeroSlider";
import CategoryGrid from "@/components/CategoryGrid";
import CategoryProducts from "@/components/CategoryProducts";
import NewArrivals from "@/components/NewArrivals";
import BestSellers from "@/components/BestSellers";
import BrandStory from "@/components/BrandStory";
import Footer from "@/components/Footer";

export default function HomePage() {
  return (
    <main>
      <Header />
      <HeroSlider />
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
