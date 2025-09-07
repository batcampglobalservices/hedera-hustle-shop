import { Button } from "@/components/ui/button";
import { ArrowRight, Zap, Shield, Coins } from "lucide-react";
import heroImage from "@/assets/hero-image.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-hero opacity-90" />
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{ backgroundImage: `url(${heroImage})` }}
      />
      
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-primary rounded-full opacity-20 blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-primary-glow rounded-full opacity-15 blur-2xl animate-pulse delay-1000" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 bg-background/10 backdrop-blur-sm border border-white/20 rounded-full px-6 py-2 mb-8">
            <Zap className="w-4 h-4 text-warning" />
            <span className="text-white font-medium">Powered by Hedera Blockchain</span>
          </div>

          {/* Main heading */}
          <h1 className="text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            The Future of
            <span className="block bg-gradient-to-r from-white to-primary-glow bg-clip-text text-transparent">
              Decentralized Commerce
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-xl lg:text-2xl text-white/80 mb-12 max-w-2xl mx-auto leading-relaxed">
            Shop with cryptocurrency, earn rewards, and own your digital assets in the world's most secure ecommerce platform.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button size="lg" className="bg-white text-primary hover:bg-white/90 font-semibold px-8 py-6 text-lg">
              Start Shopping
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="border-white/30 text-white hover:bg-white/10 backdrop-blur-sm px-8 py-6 text-lg"
            >
              Connect Wallet
            </Button>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="flex flex-col items-center space-y-3 p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
              <div className="w-12 h-12 bg-success/20 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-success" />
              </div>
              <h3 className="text-white font-semibold">Secure Payments</h3>
              <p className="text-white/70 text-sm text-center">
                Enterprise-grade security with Hedera's distributed ledger technology
              </p>
            </div>

            <div className="flex flex-col items-center space-y-3 p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
              <div className="w-12 h-12 bg-warning/20 rounded-xl flex items-center justify-center">
                <Zap className="w-6 h-6 text-warning" />
              </div>
              <h3 className="text-white font-semibold">Instant Transactions</h3>
              <p className="text-white/70 text-sm text-center">
                Lightning-fast payments with minimal fees on Hedera network
              </p>
            </div>

            <div className="flex flex-col items-center space-y-3 p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
              <div className="w-12 h-12 bg-info/20 rounded-xl flex items-center justify-center">
                <Coins className="w-6 h-6 text-info" />
              </div>
              <h3 className="text-white font-semibold">Crypto Rewards</h3>
              <p className="text-white/70 text-sm text-center">
                Earn HBAR tokens with every purchase and referral
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;