import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Heart, Menu, Wallet, ChevronDown, LogOut, Copy, User, FileText, ShieldCheck } from 'lucide-react';
import { useWallet } from '@/hooks/useWallet';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import SignInModal from '@/components/SignInModal';
import SignUpModal from '@/components/SignUpModal';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showSignIn, setShowSignIn] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const [prefilledEmail, setPrefilledEmail] = useState<string | undefined>();
  const location = useLocation();
  const { isConnected, address, formattedAddress, connectWallet, disconnectWallet, isLoading } = useWallet();
  const { user, signOut, linkWallet } = useAuth();

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Campaigns', href: '/campaigns' },
    { name: 'About', href: '/about' },
    { name: 'Impact', href: '/impact' },
    { name: 'My Certificates', href: '/certificates' },
    { name: 'Contact', href: '/contact' },
  ];

  const isActive = (href: string) => location.pathname === href;

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      toast.success('Address copied to clipboard!');
    }
  };

  // Handle wallet connection with account linking
  const handleConnectWallet = async () => {
    await connectWallet();
    // If user is signed in and wallet connects, link them
    if (user && !user.walletAddress && address) {
      linkWallet(address);
    }
  };

  const handleSwitchToSignUp = (email?: string) => {
    setShowSignIn(false);
    setPrefilledEmail(email);
    setShowSignUp(true);
  };

  const handleSwitchToSignIn = () => {
    setShowSignUp(false);
    setPrefilledEmail(undefined);
    setShowSignIn(true);
  };

  const getUserFirstName = () => {
    if (!user) return '';
    return user.name.split(' ')[0];
  };

  const WalletButton = () => {
    if (!isConnected) {
      return (
        <Button 
          size="sm" 
          variant="outline"
          onClick={handleConnectWallet}
          disabled={isLoading}
        >
          <Wallet className="h-4 w-4 mr-2" />
          {isLoading ? 'Connecting...' : 'Connect Wallet'}
        </Button>
      );
    }

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-2 bg-primary/10 border-primary/20 hover:bg-primary/20"
          >
            <Wallet className="h-4 w-4" />
            <span className="font-mono text-sm">{formattedAddress}</span>
            <ChevronDown className="h-3 w-3" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48 bg-background border border-border shadow-lg">
          <DropdownMenuItem onClick={copyAddress} className="cursor-pointer">
            <Copy className="h-4 w-4 mr-2" />
            Copy Address
          </DropdownMenuItem>
          {user && !user.walletAddress && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => linkWallet(address!)} className="cursor-pointer">
                <ShieldCheck className="h-4 w-4 mr-2" />
                Link to Account
              </DropdownMenuItem>
            </>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={disconnectWallet} className="cursor-pointer text-destructive">
            <LogOut className="h-4 w-4 mr-2" />
            Disconnect Wallet
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  const UserMenu = () => {
    if (!user) {
      return (
        <Button 
          size="sm" 
          variant="default"
          className="bg-primary text-primary-foreground hover:bg-primary/90"
          onClick={() => setShowSignIn(true)}
        >
          Sign In
        </Button>
      );
    }

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-2"
          >
            <User className="h-4 w-4" />
            <span>Welcome, {getUserFirstName()}</span>
            <ChevronDown className="h-3 w-3" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48 bg-background border border-border shadow-lg">
          <DropdownMenuItem asChild className="cursor-pointer">
            <Link to="/profile">
              <User className="h-4 w-4 mr-2" />
              Profile
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild className="cursor-pointer">
            <Link to="/certificates">
              <FileText className="h-4 w-4 mr-2" />
              My Certificates
            </Link>
          </DropdownMenuItem>
          {user.walletAddress && (
            <DropdownMenuItem disabled className="text-muted-foreground">
              <Wallet className="h-4 w-4 mr-2" />
              <span className="font-mono text-xs">{user.walletAddress.slice(0, 6)}...{user.walletAddress.slice(-4)}</span>
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={signOut} className="cursor-pointer text-destructive">
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-hero">
            <Heart className="h-4 w-4 text-white" />
          </div>
          <span className="text-xl font-bold gradient-text">Donify</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive(item.href)
                  ? 'text-primary'
                  : 'text-muted-foreground'
              }`}
            >
              {item.name}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center space-x-4">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/start-campaign">Start Campaign</Link>
          </Button>
          <WalletButton />
          <UserMenu />
        </div>

        {/* Mobile Navigation */}
        <div className="flex items-center gap-2 md:hidden">
          <UserMenu />
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <div className="flex flex-col space-y-4 mt-4">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`text-lg font-medium transition-colors hover:text-primary ${
                      isActive(item.href)
                        ? 'text-primary'
                        : 'text-muted-foreground'
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
                <div className="flex flex-col space-y-2 pt-4 border-t">
                  <Button variant="ghost" asChild>
                    <Link to="/start-campaign">Start Campaign</Link>
                  </Button>
                  <WalletButton />
                  {!user && (
                    <Button 
                      variant="default"
                      className="bg-primary text-primary-foreground hover:bg-primary/90"
                      onClick={() => {
                        setIsOpen(false);
                        setShowSignIn(true);
                      }}
                    >
                      Sign In
                    </Button>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
      
      {/* Auth Modals */}
      <SignInModal 
        isOpen={showSignIn} 
        onClose={() => setShowSignIn(false)}
        onSwitchToSignUp={handleSwitchToSignUp}
      />
      <SignUpModal 
        isOpen={showSignUp} 
        onClose={() => setShowSignUp(false)}
        onSwitchToSignIn={handleSwitchToSignIn}
        prefilledEmail={prefilledEmail}
      />
    </nav>
  );
};

export default Navigation;