import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, ShoppingCart, Heart, Zap, Loader2 } from "lucide-react";
import { useProducts } from "@/hooks/useProducts";
import { useWallet } from "@/contexts/WalletContext";
import { toast } from "@/hooks/use-toast";

const ProductGrid = () => {
  const { data: products, isLoading, error } = useProducts();
  const { isConnected, sendTransaction } = useWallet();

  const handleBuyWithHBAR = async (product: any) => {
    if (!isConnected) {
      toast({
        title: "Wallet Required",
        description: "Please connect your wallet to make purchases with HBAR.",
      });
      return;
    }

    // Convert USD price to HBAR (mock conversion rate: 1 HBAR = $0.10)
    const hbarAmount = Math.ceil(product.price * 10);
    
    const transactionId = await sendTransaction("0.0.123456", hbarAmount);
    
    if (transactionId) {
      toast({
        title: "Purchase Successful!",
        description: `You bought ${product.name} for ${hbarAmount} HBAR. Transaction: ${transactionId}`,
      });
    }
  };

  if (isLoading) {
    return (
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center">
            <p className="text-destructive">Error loading products. Please try again later.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 px-4">
      <div className="container mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Featured Products</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover premium products available for both traditional and cryptocurrency payments
          </p>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products?.map((product) => (
            <Card key={product.id} className="group overflow-hidden border-0 shadow-card hover:shadow-primary transition-all duration-300 hover:-translate-y-2 bg-gradient-card">
              <CardHeader className="p-0 relative">
                <div className="aspect-square overflow-hidden rounded-t-lg">
                  <img 
                    src={product.image_url || "/placeholder.svg"} 
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                
                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  {product.stock_quantity < 10 && (
                    <Badge className="bg-warning text-warning-foreground">
                      Low Stock
                    </Badge>
                  )}
                  {product.hedera_token_id && (
                    <Badge variant="outline" className="bg-background/80 backdrop-blur-sm border-primary/50">
                      <Zap className="w-3 h-3 mr-1" />
                      Crypto
                    </Badge>
                  )}
                </div>

                {/* Wishlist Button */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-4 right-4 bg-background/80 backdrop-blur-sm hover:bg-background/90"
                >
                  <Heart className="w-4 h-4" />
                </Button>
              </CardHeader>

              <CardContent className="p-6">
                <div className="mb-2">
                  <Badge variant="secondary" className="text-xs">
                    {product.categories?.name || 'General'}
                  </Badge>
                </div>
                
                <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                  {product.name}
                </h3>
                
                <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                  {product.description}
                </p>

                <div className="flex items-center space-x-2 mb-3">
                  <span className="text-2xl font-bold text-primary">
                    ${product.price}
                  </span>
                  <Badge variant="outline" className="text-xs">
                    Stock: {product.stock_quantity}
                  </Badge>
                </div>

                {product.hedera_token_id && (
                  <div className="text-xs text-muted-foreground mb-2">
                    HTS Token: {product.hedera_token_id}
                  </div>
                )}
              </CardContent>

              <CardFooter className="p-6 pt-0 space-y-2">
                <Button className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Add to Cart
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => handleBuyWithHBAR(product)}
                  disabled={!isConnected}
                >
                  Buy with HBAR
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Load More Button */}
        <div className="text-center mt-12">
          <Button variant="outline" size="lg" className="px-8">
            Load More Products
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ProductGrid;