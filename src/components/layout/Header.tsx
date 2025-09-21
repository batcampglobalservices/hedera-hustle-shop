import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Search, User, Menu, LogOut } from "lucide-react";
import WalletConnect from "@/components/wallet/WalletConnect";
import { AuthModal } from "@/components/auth/AuthModal";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from '@/contexts/CartContext';
import { Link } from 'react-router-dom';
const Header = () => {
  const { user, signOut, loading } = useAuth();

  return <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">H</span>
          </div>
          <span className="font-bold text-xl bg-gradient-primary bg-clip-text text-transparent">BatCommerce</span>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <a href="#" className="text-foreground hover:text-primary transition-colors">Products</a>
          <a href="#" className="text-foreground hover:text-primary transition-colors">Categories</a>
          <a href="#" className="text-foreground hover:text-primary transition-colors">NFTs</a>
          <a href="#" className="text-foreground hover:text-primary transition-colors">About</a>
        </nav>

        {/* Actions */}
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" className="hidden sm:flex">
            <Search className="w-4 h-4" />
          </Button>
          
          <Link to="/cart">
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingCart className="w-4 h-4" />
              <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                {useCart().items.length}
              </Badge>
            </Button>
          </Link>

          {!loading && (
            <>
              {user ? (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground hidden sm:block">
                    {user.email}
                  </span>
                  <Link to="/products/new">
                    <Button variant="ghost" size="icon">Create</Button>
                  </Link>
                  <Button variant="ghost" size="icon" onClick={signOut}>
                    <LogOut className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <AuthModal>
                  <Button variant="ghost" size="icon">
                    <User className="w-4 h-4" />
                  </Button>
                </AuthModal>
              )}
              
              <div className="hidden lg:block">
                <WalletConnect />
              </div>
            </>
          )}

          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </header>;
};
export default Header;