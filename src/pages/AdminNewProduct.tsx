import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { supabase } from '@/integrations/supabase/client';
import { connectAndTransfer } from '@/integrations/hashconnect/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';
import { AuthModal } from '@/components/auth/AuthModal';

const AdminNewProduct = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<number | ''>('');
  const [imageUrl, setImageUrl] = useState('');
  const [stock, setStock] = useState<number | ''>('');
  const [isActive, setIsActive] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  if (loading) return null;

  if (!user) {
    return (
      <div className="container mx-auto py-12 text-center">
        <p className="mb-4">You must be signed in to create products.</p>
        <AuthModal>
          <Button>Sign in to continue</Button>
        </AuthModal>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price) {
      toast({ title: 'Validation', description: 'Name and price are required', variant: 'destructive' });
      return;
    }

    setIsLoading(true);
    try {
      const payload: any = {
        name,
        description: description || null,
        price: Number(price),
        image_url: imageUrl || null,
        stock_quantity: Number(stock) || 0,
        is_active: Boolean(isActive),
      };

      // If we have a logged-in user, attach as owner (try several common id fields)
      try {
        const uid = (user as any)?.id || (user as any)?.sub || (user as any)?.user_id;
        console.debug('Creating product as user:', user, 'resolved uid=', uid);
        if (uid) payload.owner_id = uid;
      } catch (e) {
        console.debug('Error reading user id', e);
      }

      const { data, error } = await supabase.from('products').insert([payload]).select().maybeSingle();
      if (error) {
        // Surface detailed error for debugging RLS / permission issues
        console.error('Supabase insert error', error);

        // If the error indicates owner_id doesn't exist in DB schema, retry without owner_id
        const msg = (error?.message || '').toLowerCase();
        if (msg.includes('owner_id') || msg.includes('could not find') || msg.includes('column') && msg.includes('does not exist')) {
          try {
            const { data: data2, error: error2 } = await supabase.from('products').insert([
              {
                name,
                description: description || null,
                price: Number(price),
                image_url: imageUrl || null,
                stock_quantity: Number(stock) || 0,
                is_active: Boolean(isActive),
              },
            ]).select().maybeSingle();

            if (error2) {
              console.error('Retry insert (no owner_id) failed', error2);
              toast({ title: 'Create failed', description: error2.message || JSON.stringify(error2), variant: 'destructive' });
              setIsLoading(false);
              return;
            }

            toast({ title: 'Product created', description: `Created ${data2?.name || name}` });
            navigate('/');
            return;
          } catch (e: any) {
            console.error('Retry insert threw', e);
            toast({ title: 'Create failed', description: e?.message || String(e), variant: 'destructive' });
            setIsLoading(false);
            return;
          }
        }

        toast({ title: 'Create failed', description: error.message || JSON.stringify(error), variant: 'destructive' });
        setIsLoading(false);
        return;
      }

      toast({ title: 'Product created', description: `Created ${data?.name || name}` });

      // Prompt the creator to confirm by sending a small HBAR transfer from their wallet
      try {
        const tx = await connectAndTransfer({ toAccount: process.env.VITE_HEDERA_TESTNET_ACCOUNT_ID || '0.0.123456', amount: 1 });
        // Update product with confirmation
        await supabase.from('products').update({ confirmed: true, confirmation_tx: tx }).eq('id', data.id);
        toast({ title: 'Product confirmed', description: `Confirmation tx: ${tx}` });
      } catch (e: any) {
        console.warn('Payment/confirmation failed or not configured', e?.message || e);
        toast({ title: 'Confirmation skipped', description: 'Wallet confirmation not completed. Install and pair a Hedera wallet and retry if needed.' });
      }

      navigate('/');
    } catch (err: any) {
      toast({ title: 'Create failed', description: err.message || 'Failed to create product', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-12">
      <h2 className="text-2xl font-semibold mb-6">Create New Product</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 max-w-xl">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Input id="description" value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>

        <div>
          <Label htmlFor="price">Price (USD)</Label>
          <Input id="price" type="number" value={price as any} onChange={(e) => setPrice(e.target.value === '' ? '' : Number(e.target.value))} required />
        </div>

        <div>
          <Label htmlFor="image">Image URL</Label>
          <Input id="image" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
        </div>

        <div>
          <Label htmlFor="stock">Stock Quantity</Label>
          <Input id="stock" type="number" value={stock as any} onChange={(e) => setStock(e.target.value === '' ? '' : Number(e.target.value))} />
        </div>

        <div className="flex items-center gap-2">
          <Checkbox id="active" checked={isActive} onCheckedChange={(v) => setIsActive(Boolean(v))} />
          <Label htmlFor="active">Active</Label>
        </div>

        <div className="flex gap-2">
          <Button type="submit" disabled={isLoading}>{isLoading ? 'Creating...' : 'Create Product'}</Button>
          <Button variant="outline" onClick={() => navigate('/')}>Cancel</Button>
        </div>
      </form>
    </div>
  );
};

export default AdminNewProduct;
