
import RoomForm from "@/components/RoomForm";
import { ThumbsUp, Users, MonitorPlay, MessagesSquare } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-[calc(100vh-8rem)] flex flex-col">
      <div className="relative flex-1 flex items-center justify-center p-6">
        {/* Background with gradient */}
        <div 
          className="absolute inset-0 bg-gradient-to-br from-binge-blue/50 via-background to-background z-[-1] dark:from-binge-blue/20"
          style={{ 
            backgroundImage: "url('data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')"
          }}
        />
        
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="md:w-1/2 text-center md:text-left">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 tracking-tight">
              <span className="text-foreground">Watch together.</span>
              <br />
              <span className="text-binge-pink">Laugh together.</span>
              <br />
              <span className="text-binge-yellow">BingeBuddies.</span>
            </h1>
            <p className="text-lg md:text-xl mb-8 text-muted-foreground max-w-lg mx-auto md:mx-0">
              Synchronize your movie night with friends and family. Chat, react, and enjoy together - no matter where you are.
            </p>
            
            <div className="hidden md:flex flex-wrap gap-6 mt-8">
              {[
                { icon: MonitorPlay, text: "Synchronized video playback" },
                { icon: MessagesSquare, text: "Live chat while watching" },
                { icon: Users, text: "Watch with friends anywhere" },
                { icon: ThumbsUp, text: "React to moments in real-time" }
              ].map((feature, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="rounded-full bg-primary/10 p-2">
                    <feature.icon size={18} className="text-primary" />
                  </div>
                  <span className="text-sm">{feature.text}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="w-full max-w-md md:w-1/2">
            <RoomForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
