import React from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface SocialCardProps {
  platform: string;
  icon: React.ReactNode;
  content: string | React.ReactNode;
  className?: string;
}

const SocialCard = ({ platform, icon, content, className }: SocialCardProps) => {
  return (
    <Card
      className={cn(
        "group relative overflow-hidden bg-card/80 backdrop-blur-lg shadow-lg rounded-2xl transition-all duration-300 hover:shadow-xl hover:scale-[1.02]",
        className
      )}
    >
      <div className="p-6 flex flex-col gap-3">
        <div className="flex items-center gap-4">
          <div className="text-primary text-2xl">{icon}</div>
          <h3 className="text-lg font-semibold text-text-primary">{platform}</h3>
        </div>
        <div className="text-sm text-text-secondary leading-relaxed">{content}</div>
      </div>
    </Card>
  );
};

export default SocialCard;
