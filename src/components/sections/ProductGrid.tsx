import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, ShoppingCart, Heart, Zap } from "lucide-react";

const products = [
  {
    id: 1,
    name: "Premium NFT Headphones",
    price: "50 HBAR",
    originalPrice: "75 HBAR",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
    rating: 4.8,
    reviews: 124,
    category: "Electronics",
    isNew: true,
    isCrypto: true
  },
  {
    id: 2,
    name: "Smart Watch Series X",
    price: "120 HBAR",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop",
    rating: 4.9,
    reviews: 89,
    category: "Electronics",
    isCrypto: true
  },
  {
    id: 3,
    name: "Designer Sneakers",
    price: "$199",
    originalPrice: "$299",
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop",
    rating: 4.7,
    reviews: 203,
    category: "Fashion",
    isNew: false,
    isCrypto: false
  },
  {
    id: 4,
    name: "Blockchain Gaming Mouse",
    price: "25 HBAR",
    image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=400&fit=crop",
    rating: 4.6,
    reviews: 67,
    category: "Gaming",
    isCrypto: true
  },
  {
    id: 5,
    name: "Crypto Art Print",
    price: "15 HBAR",
    image: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=400&fit=crop",
    rating: 4.9,
    reviews: 156,
    category: "Art",
    isNew: true,
    isCrypto: true
  },
  {
    id: 6,
    name: "Premium Coffee Beans",
    price: "$45",
    image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&h=400&fit=crop",
    rating: 4.8,
    reviews: 91,
    category: "Food",
    isCrypto: false
  }
];

const ProductGrid = () => {
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
          {products.map((product) => (
            <Card key={product.id} className="group overflow-hidden border-0 shadow-card hover:shadow-primary transition-all duration-300 hover:-translate-y-2 bg-gradient-card">
              <CardHeader className="p-0 relative">
                <div className="aspect-square overflow-hidden rounded-t-lg">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                
                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  {product.isNew && (
                    <Badge className="bg-success text-success-foreground">
                      New
                    </Badge>
                  )}
                  {product.isCrypto && (
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
                    {product.category}
                  </Badge>
                </div>
                
                <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                  {product.name}
                </h3>
                
                <div className="flex items-center mb-3">
                  <div className="flex items-center">
                    <Star className="w-4 h-4 fill-warning text-warning" />
                    <span className="ml-1 font-medium">{product.rating}</span>
                  </div>
                  <span className="text-muted-foreground text-sm ml-2">
                    ({product.reviews} reviews)
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-2xl font-bold text-primary">
                    {product.price}
                  </span>
                  {product.originalPrice && (
                    <span className="text-muted-foreground line-through">
                      {product.originalPrice}
                    </span>
                  )}
                </div>
              </CardContent>

              <CardFooter className="p-6 pt-0">
                <Button className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Add to Cart
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