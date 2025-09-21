import { useParams, Link } from "react-router-dom";
import { useProduct } from "@/hooks/useProducts";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useWallet } from "@/contexts/WalletContext";
import { toast } from "@/hooks/use-toast";

const ProductPage = () => {
  const { id } = useParams<{ id: string }>();
  const { data: product, isLoading, error } = useProduct(id || "");

  if (isLoading) {
    return (
      <div className="container mx-auto py-20 flex items-center justify-center">
        <Loader2 className="animate-spin h-8 w-8" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto py-20 text-center">
        <h2 className="text-2xl font-semibold">Product not found</h2>
        <p className="text-muted-foreground mt-2">The product may have been removed or does not exist.</p>
        <div className="mt-6">
          <Link to="/">
            <Button variant="outline">Back to store</Button>
          </Link>
        </div>
      </div>
    );
  }

  const { addToCart } = useCart();
  const { isConnected, sendTransaction } = useWallet();

  const handleAdd = () => addToCart(product);

  const handleBuy = async () => {
    if (!isConnected) {
      toast({ title: 'Wallet Required', description: 'Please connect your wallet to complete the purchase.' });
      return;
    }

    // Simple conversion and checkout flow (mock and uses wallet.sendTransaction)
    const hbarAmount = Math.ceil(product.price * 10);
    const tx = await sendTransaction('0.0.123456', hbarAmount);
    if (tx) {
      toast({ title: 'Purchase Complete', description: `Transaction ${tx}` });
    }
  };

  return (
    <div className="container mx-auto py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <img src={product.image_url || "/placeholder.svg"} alt={product.name} className="w-full rounded-lg object-cover" />
        </div>
        <div>
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
          <p className="text-muted-foreground mb-4">{product.description}</p>
          <div className="text-2xl font-semibold text-primary mb-4">${product.price}</div>
          <div className="mb-4">Stock: {product.stock_quantity}</div>
          <div className="space-y-2">
            <Button className="w-full" onClick={handleAdd}>Add to Cart</Button>
            <Button variant="outline" className="w-full" onClick={handleBuy}>Buy with HBAR</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
