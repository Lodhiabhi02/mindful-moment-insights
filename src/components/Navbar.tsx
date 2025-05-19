
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Brain, BarChart, MessageSquare, Settings, LogOut, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const Navbar = () => {
  const location = useLocation();
  const { user, signOut } = useAuth();
  
  return (
    <header className="sticky top-0 w-full py-4 px-6 bg-background border-b z-10">
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        <Link to="/" className="flex items-center gap-2">
          <Brain className="h-8 w-8 text-primary" />
          <span className="text-2xl font-semibold">MindSense</span>
        </Link>

        {user ? (
          <div className="flex items-center gap-4">
            <nav className="hidden md:flex items-center gap-1">
              <Link to="/">
                <Button variant={location.pathname === '/' ? 'default' : 'ghost'}>
                  <Brain className="h-4 w-4 mr-2" />
                  Home
                </Button>
              </Link>
              <Link to="/journal">
                <Button variant={location.pathname === '/journal' ? 'default' : 'ghost'}>
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Journal
                </Button>
              </Link>
              <Link to="/insights">
                <Button variant={location.pathname === '/insights' ? 'default' : 'ghost'}>
                  <BarChart className="h-4 w-4 mr-2" />
                  Insights
                </Button>
              </Link>
            </nav>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Avatar>
                    <AvatarFallback>{user.email?.charAt(0).toUpperCase() || 'U'}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="cursor-pointer w-full flex items-center">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/settings" className="cursor-pointer w-full flex items-center">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={() => signOut()}
                  className="cursor-pointer text-destructive focus:text-destructive"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ) : (
          <Link to="/auth">
            <Button>Sign in</Button>
          </Link>
        )}
      </div>
    </header>
  );
};

export default Navbar;
