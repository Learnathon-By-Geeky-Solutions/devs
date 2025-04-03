import { ReactNode } from 'react';

interface QuickLinkCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  hoverColor: string;
  borderColor: string;
  bgColor: string;
}

export function QuickLinkCard({
  icon,
  title,
  description,
  hoverColor,
  borderColor,
  bgColor,
}: QuickLinkCardProps) {
  return (
    <div
      className={`bg-background/80 backdrop-blur-md rounded-lg p-4 border flex items-center gap-3 hover:${hoverColor} hover:border-${borderColor} transition-all`}
    >
      <div className={`${bgColor} rounded-full p-2`}>{icon}</div>
      <div className="text-left">
        <h3 className="font-medium">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}
