import { ClerkProvider, SignUpButton, SignInButton, Show, UserButton } from '@clerk/nextjs';
import {DropdownMenu,DropdownMenuContent,DropdownMenuItem,DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import { StarsIcon,FileText, PenBox, GraduationCap } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LayoutDashboard } from "lucide-react";

export default function Header() {
  return (
    <header className="fixed top-0 w-full border-b bg-background/80 backdrop-blur-md z-50 supports-[backdrop-filter]:bg-background/60">
      <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* Logo Section */}
        <Link href='/'>
          <Image 
            src="/pivot-logo.png" 
            alt='Pivot Logo' 
            width={200} 
            height={60}
            className='h-13 py-1 w-auto object-contain'
          />
        </Link>

  <div className="flex items-center gap-4">
  
 
    {/* Logged Out State */}
    <Show when="signed-out">
      <SignInButton>
        <Button variant="outline">Sign In</Button>
      </SignInButton>
    </Show>

    <Show when="signed-in">
    
    <Link href="/dashboard">
      <Button variant="outline">
        <LayoutDashboard className="h-4 w-4 mr-2" />
        <span className="hidden md:block">Industry Insights</span>
      </Button>
    </Link>

    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='outline'>
          <StarsIcon className="h-4 w-4 mr-2" />
          <span className="hidden md:block">Growth Tools</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent>
        <DropdownMenuItem>
          <Link href="/resume" className="flex items-center gap-2 w-full">
            <FileText className="h-4 w-4" />
            <span>Build Resume</span>
          </Link>
        </DropdownMenuItem>
        
        <DropdownMenuItem>
          <Link href="/ai-cover-letter" className="flex items-center gap-2 w-full">
            <PenBox className="h-4 w-4" />
            <span>Cover Letter</span>
          </Link>
        </DropdownMenuItem>
        
        <DropdownMenuItem>
          <Link href="/interview" className="flex items-center gap-2 w-full">
            <GraduationCap className="h-4 w-4" />
            <span>Interview Prep</span>
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>

    <UserButton />
    </Show>

  </div>
      </nav>
    </header>
  );
}