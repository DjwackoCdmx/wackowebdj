import { Button } from "@/components/ui/button";

interface HistoryTabsProps {
  activeTab: 'history' | 'saved';
  setActiveTab: (tab: 'history' | 'saved') => void;
}

export const HistoryTabs = ({ activeTab, setActiveTab }: HistoryTabsProps) => (
  <div className="flex gap-2 justify-center">
    <Button
      onClick={() => setActiveTab('history')}
      variant={activeTab === 'history' ? 'default' : 'outline'}
      className="bg-gradient-to-r from-primary to-secondary hover:scale-105 transition-all"
    >
      Mi Historial
    </Button>
    <Button
      onClick={() => setActiveTab('saved')}
      variant={activeTab === 'saved' ? 'default' : 'outline'}
      className="bg-gradient-to-r from-primary to-secondary hover:scale-105 transition-all"
    >
      Mis Favoritos
    </Button>
  </div>
);
