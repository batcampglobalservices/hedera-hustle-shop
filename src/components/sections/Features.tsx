import { Card, CardContent } from "@/components/ui/card";
import { 
  Shield, 
  Zap, 
  Coins, 
  Globe, 
  Lock, 
  Sparkles,
  TrendingUp,
  Users
} from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "Secure Transactions",
    description: "Enterprise-grade security powered by Hedera's distributed ledger technology ensures your transactions are always safe.",
    color: "text-success"
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Experience instant transactions with Hedera's high-throughput consensus algorithm. No waiting, just shopping.",
    color: "text-warning"
  },
  {
    icon: Coins,
    title: "Multi-Currency Support",
    description: "Pay with HBAR, Bitcoin, Ethereum, or traditional payment methods. Your choice, your convenience.",
    color: "text-info"
  },
  {
    icon: Globe,
    title: "Global Marketplace",
    description: "Shop from anywhere, sell to everyone. Our decentralized platform connects buyers and sellers worldwide.",
    color: "text-primary"
  },
  {
    icon: Lock,
    title: "Privacy First",
    description: "Your data remains yours. We use advanced encryption and decentralized storage to protect your privacy.",
    color: "text-destructive"
  },
  {
    icon: Sparkles,
    title: "NFT Integration",
    description: "Buy, sell, and trade unique digital assets. Every purchase can be minted as an NFT proof of ownership.",
    color: "text-accent-foreground"
  },
  {
    icon: TrendingUp,
    title: "Earn While Shopping",
    description: "Get rewarded with HBAR tokens for every purchase, review, and referral. Your loyalty pays off.",
    color: "text-success"
  },
  {
    icon: Users,
    title: "Community Driven",
    description: "Join a community of forward-thinking shoppers and merchants building the future of commerce together.",
    color: "text-info"
  }
];

const Features = () => {
  return (
    <section className="py-20 px-4 bg-gradient-surface">
      <div className="container mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">
            Why Choose 
            <span className="bg-gradient-primary bg-clip-text text-transparent ml-2">
              HederaMart
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Experience the next generation of ecommerce with cutting-edge blockchain technology, 
            unmatched security, and revolutionary features designed for the modern digital economy.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <Card 
                key={index} 
                className="group border-0 shadow-card hover:shadow-primary transition-all duration-300 hover:-translate-y-1 bg-card/50 backdrop-blur-sm"
              >
                <CardContent className="p-6 text-center">
                  <div className="mb-4 flex justify-center">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <IconComponent className={`w-8 h-8 ${feature.color} group-hover:scale-110 transition-transform duration-300`} />
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors">
                    {feature.title}
                  </h3>
                  
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center space-x-2 bg-primary/5 backdrop-blur-sm border border-primary/20 rounded-full px-6 py-3">
            <Sparkles className="w-5 h-5 text-primary" />
            <span className="text-primary font-medium">
              Join 50,000+ satisfied customers already shopping with crypto
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;