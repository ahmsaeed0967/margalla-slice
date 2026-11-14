import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import BottomNav from "../components/layout/BottomNav";
import Hero from "../components/sections/Hero";
import DealsSection from "../components/sections/DealsSection";
import MenuSections from "../components/sections/MenuSections";
import AboutSection from "../components/sections/AboutSection";
import CategoryBar from "../components/menu/CategoryBar";
import Reviews from "../components/sections/Reviews";
import LocationMap from "../components/sections/LocationMap";
import BasketBar from "../components/cart/BasketBar";
import CartDrawer from "../components/cart/CartDrawer";

// Order: Hero, Deals, Menu, About, Reviews, Location, Footer
export default function Home() {
  return (
    <>
      <Header />
      <Hero />
      {/* The category chips stay stuck only while deals + menu are on screen */}
      <div>
        <CategoryBar />
        <DealsSection />
        <MenuSections />
      </div>
      <AboutSection />
      <Reviews />
      <LocationMap />
      <Footer />
      <BasketBar />
      <BottomNav />
      <CartDrawer />
    </>
  );
}
