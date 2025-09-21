import { supabase } from '@/integrations/supabase/client';
import { useCart } from '@/contexts/CartContext';
import { useWallet } from '@/contexts/WalletContext';
import { useAuth } from './useAuth';

export const useCheckout = () => {
  const { items, clearCart, total } = useCart();
  const { sendTransaction } = useWallet();
  const { user } = useAuth();

  const checkout = async (opts?: { paymentAccount?: string }) => {
    const paymentAccount = opts?.paymentAccount || '0.0.123456';
    const hbarAmount = Math.ceil(total * 10);

    // send payment via wallet
    const tx = await sendTransaction(paymentAccount, hbarAmount);
    if (!tx) throw new Error('Payment failed');

    // Create order record with user_id if available
    const orderPayload: any = {
      payment_method: 'hbar',
      hedera_transaction_id: tx,
      status: 'paid',
      total_amount: total,
    };
    if (user?.id) orderPayload.user_id = user.id;

    const { data: orderData, error: orderErr } = await supabase.from('orders').insert([orderPayload]).select('id').maybeSingle();
    if (orderErr || !orderData) {
      throw orderErr || new Error('Failed to create order');
    }

    const orderId = (orderData as any).id;

    // Insert order items
    const orderItems = items.map((i) => ({ order_id: orderId, product_id: i.product.id, quantity: i.quantity, price: i.product.price }));
    const { error: itemsErr } = await supabase.from('order_items').insert(orderItems);
    if (itemsErr) {
      throw itemsErr;
    }

    // Decrement stock using update (best-effort)
    for (const i of items) {
      try {
        await supabase
          .from('products')
          .update({ stock_quantity: Math.max(0, i.product.stock_quantity - i.quantity) })
          .eq('id', i.product.id);
      } catch (e) {
        // ignore failures to update stock
      }
    }

    clearCart();
    return { orderId, tx };
  };

  return { checkout, total };
};
