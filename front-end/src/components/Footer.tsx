
import { Heart } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-t mt-auto py-6 px-6 md:px-8">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-primary">BingeBuddies</span>
            <span className="text-sm text-muted-foreground">&copy; {new Date().getFullYear()}</span>
          </div>
          
          <div className="flex items-center gap-1 text-sm">
            <span>Made with</span>
            <Heart size={14} className="text-primary fill-primary" />
            <span>for movie nights</span>
          </div>
          
          <div className="flex gap-4 text-sm">
            <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
              Home
            </Link>
            <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
              About
            </Link>
            <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
              Privacy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
