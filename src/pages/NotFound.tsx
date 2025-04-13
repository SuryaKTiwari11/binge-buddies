
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Home } from "lucide-react";

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-binge-blue to-background">
      <div className="text-center">
        <h1 className="text-9xl font-bold mb-4 text-binge-yellow">404</h1>
        <p className="text-xl mb-8">Oops! This page doesn't exist.</p>
        <Link to="/">
          <Button>
            <Home size={18} className="mr-2" />
            Back to Home
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
