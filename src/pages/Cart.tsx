import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useCheckout } from '@/hooks/useCheckout';
import { useWallet } from '@/contexts/WalletContext';
import { toast } from '@/hooks/use-toast';

const CartPage = () => {
  const { items, removeFromCart, total } = useCart();
  const { checkout } = useCheckout();
  const { isConnected, connectWallet } = useWallet();

  const handleCheckout = async () => {
    if (!isConnected) {
      await connectWallet();
      toast({ title: 'Wallet Connected', description: 'Please re-run checkout.' });
      return;
    }

    try {
      const { orderId, tx } = await checkout();
      toast({ title: 'Order Placed', description: `Order ${orderId} (tx ${tx})` });
    } catch (e) {
      toast({ title: 'Checkout Failed', description: (e as Error).message || 'Failed to place order', variant: 'destructive' });
    }
  };

  return (
    <div className="container mx-auto py-12">
      <h2 className="text-2xl font-semibold mb-4">Cart</h2>
      {items.length === 0 ? (
        <div>
          <p className="text-muted-foreground">Your cart is empty.</p>
          <Link to="/">
            <Button className="mt-4">Continue Shopping</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((i) => (
            <div key={i.product.id} className="flex items-center justify-between border p-4 rounded">
              <div>
                <div className="font-semibold">{i.product.name}</div>
                <div className="text-sm text-muted-foreground">Qty: {i.quantity}</div>
              </div>
              <div className="flex items-center gap-2">
                <div className="font-medium">${i.product.price * i.quantity}</div>
                <Button variant="ghost" onClick={() => removeFromCart(i.product.id)}>Remove</Button>
              </div>
            </div>
          ))}

          <div className="text-right font-semibold">Total: ${total}</div>
          <div className="flex gap-2 justify-end">
            <Button variant="outline">Continue Shopping</Button>
            <Button onClick={handleCheckout}>Checkout</Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
