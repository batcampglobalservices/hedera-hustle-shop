import Header from "@/components/layout/Header";
import Hero from "@/components/sections/Hero";
import ProductGrid from "@/components/sections/ProductGrid";
import Features from "@/components/sections/Features";
import Footer from "@/components/layout/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <ProductGrid />
        <Features />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
