import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { MobileNav, MobileHeader } from '@/components/ui/mobile-nav';
import { Button } from '@/components/ui/button';
import { LogOut, User } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

interface AppLayoutProps {
  children: React.ReactNode;
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ 
  children, 
  title = 'SokoConnect',
  showBack = false,
  onBack 
}) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  const headerActions = user ? (
    <div className="flex items-center gap-2">
      <Link to="/profile">
        <Button variant="ghost" size="sm">
          <User className="h-4 w-4" />
        </Button>
      </Link>
      <Button variant="ghost" size="sm" onClick={handleSignOut}>
        <LogOut className="h-4 w-4" />
      </Button>
    </div>
  ) : null;

  return (
    <div className="min-h-screen bg-background">
      <MobileHeader 
        title={title}
        showBack={showBack}
        onBack={onBack}
        actions={headerActions}
      />
      
      <main className="pb-20 lg:pb-4">
        {children}
      </main>
      
      <MobileNav />
    </div>
  );
};