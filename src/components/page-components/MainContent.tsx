import { SongRequestForm } from "@/components/page-components/SongRequestForm";
import { Button } from "@/components/ui/button";
import { MessageCircle, Phone, Twitter, Download } from 'lucide-react';

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
        <h1 className="text-5xl md:text-7xl font-extrabold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
          Tu Música, Tu Momento
        </h1>
        <p className="text-lg md:text-xl text-purple-300 mb-8">
          Solicita tus canciones favoritas y sé el alma de la fiesta.
        </p>
        <div className="max-w-lg mx-auto">
          <SongRequestForm
            onSubmit={onSubmit}
            isSubmitting={isSubmitting}
            isRequestTimeAllowed={isRequestTimeAllowed}
            genres={['Rock', 'Pop', '80s', '90s', 'Electrónica', 'Reggaeton']}
          />
        </div>
        <div className="mt-8 pt-6 border-t border-gray-700/50 flex flex-wrap justify-center items-center gap-4">
            <p className="text-gray-300 w-full sm:w-auto mb-4 sm:mb-0">Contacto y Descargas:</p>
            <Button asChild variant="electric">
                <a href="https://t.me/djwacko" target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="mr-2 h-4 w-4" /> Telegram
                </a>
            </Button>
            <Button asChild className="bg-green-600 hover:bg-green-700 text-white">
                <a href="https://wa.me/5256441274646" target="_blank" rel="noopener noreferrer">
                    <Phone className="mr-2 h-4 w-4" /> WhatsApp
                </a>
            </Button>
            <Button asChild className="bg-blue-500 hover:bg-blue-600 text-white">
                <a href="http://x.com/DjWackoCDMX" target="_blank" rel="noopener noreferrer">
                    <Twitter className="mr-2 h-4 w-4" /> Twitter
                </a>
            </Button>
            <Button asChild className="bg-indigo-600 hover:bg-indigo-700 text-white">
                <a href="https://github.com/DjwackoCdmx/wackowebdj/releases/download/v1.0.0/app-release.apk" target="_blank" rel="noopener noreferrer">
                    <Download className="mr-2 h-4 w-4" /> Descargar APK
                </a>
            </Button>
        </div>
      </div>
    </main>
  );
};
