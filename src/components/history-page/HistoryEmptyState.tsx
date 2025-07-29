import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Music, Heart } from "lucide-react";

interface HistoryEmptyStateProps {
  type: 'history' | 'saved';
  onActionClick: () => void;
}

type ButtonVariant = "default" | "outline";

const emptyStateConfig: Record<string, { 
  icon: React.ElementType;
  text: string;
  buttonText: string;
  buttonVariant: ButtonVariant;
}> = {
  history: {
    icon: Music,
    text: "Aún no has hecho ninguna solicitud musical.",
    buttonText: "Hacer mi primera solicitud",
    buttonVariant: "default"
  },
  saved: {
    icon: Heart,
    text: "No tienes canciones guardadas aún.",
    buttonText: "Ver mi historial",
    buttonVariant: "outline"
  }
};

export const HistoryEmptyState = ({ type, onActionClick }: HistoryEmptyStateProps) => {
  const config = emptyStateConfig[type];
  const Icon = config.icon;

  return (
    <Card className="backdrop-blur-sm bg-card/80">
      <CardContent className="text-center py-8">
        <Icon className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
        <p className="text-muted-foreground mb-4">{config.text}</p>
        <Button 
          onClick={onActionClick} 
          className={`${config.buttonVariant === 'default' ? 'bg-gradient-to-r from-primary to-secondary' : ''} hover:scale-105 transition-all`}
          variant={config.buttonVariant}
        >
          {config.buttonText}
        </Button>
      </CardContent>
    </Card>
  );
};
