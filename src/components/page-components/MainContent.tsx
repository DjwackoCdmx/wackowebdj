import { SongRequestForm } from "@/components/page-components/SongRequestForm";
import { Button } from "@/components/ui/button";
import { MessageCircle } from 'lucide-react';

interface SongFormData {
  songName: string;
  artistName: string;
  genre: string;
  requesterName: string;
  telegram: string;
}

interface MainContentProps {
  onSubmit: (formData: SongFormData) => void;
  isSubmitting: boolean;
  isRequestTimeAllowed: boolean;
}

export const MainContent = ({ onSubmit, isSubmitting, isRequestTimeAllowed }: MainContentProps) => {
  return (
    <main className="flex-grow flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-black bg-opacity-50 p-8 rounded-2xl shadow-lg border border-purple-500/30 text-center">
        <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-2">
          Tu Música, Tu Momento
        </h1>
        <p className="text-lg md:text-xl text-purple-300 mb-8">
          Tu música, tu fiesta.
        </p>
        <div className="max-w-lg mx-auto">
          <SongRequestForm
            onSubmit={onSubmit}
            isSubmitting={isSubmitting}
            isRequestTimeAllowed={isRequestTimeAllowed}
            genres={['Rock', 'Pop', '80s', '90s', 'Electrónica', 'Reggaeton', 'Otro']}
          />
        </div>
        <div className="mt-8 pt-6 border-t border-gray-700/50 flex flex-col sm:flex-row justify-center items-center gap-4">
            <p className="text-gray-300">¿Necesitas contactarme directamente?</p>
            <Button asChild variant="electric">
                <a href="https://t.me/djwacko" target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="mr-2 h-4 w-4" /> Telegram
                </a>
            </Button>
        </div>
      </div>
    </main>
  );
};
