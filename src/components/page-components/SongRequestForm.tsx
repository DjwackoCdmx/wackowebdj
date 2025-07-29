import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Send, HeartHandshake } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Terminal } from "lucide-react";

export interface SongRequestFormData {
  songName: string;
  artistName: string;
  genre: string;
  tip: string;
  telegram: string;
  requesterName: string;
}

interface SongRequestFormProps {
  onSubmit: (formData: SongRequestFormData) => void;
  isSubmitting: boolean;
  isRequestTimeAllowed: boolean;
  genres: string[];
}

export const SongRequestForm = ({ onSubmit, isSubmitting, isRequestTimeAllowed, genres }: SongRequestFormProps) => {
  const scheduleMessage = "El DJ no está aceptando solicitudes en este momento. Por favor, vuelve a intentarlo más tarde.";
  const [formData, setFormData] = useState<SongRequestFormData>({
    songName: "",
    artistName: "",
    genre: "",
    tip: "",
    telegram: "",
    requesterName: "",
  });
  const [customGenre, setCustomGenre] = useState("");
  const [showCustomGenre, setShowCustomGenre] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenreChange = (value: string) => {
    if (value === "otro") {
      setShowCustomGenre(true);
      setFormData({ ...formData, genre: "" });
    } else {
      setShowCustomGenre(false);
      setCustomGenre("");
      setFormData({ ...formData, genre: value });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!acceptedTerms) {
      setError("Debes aceptar los <strong>Términos y Condiciones</strong> para continuar.");
      return;
    }
    if (parseFloat(formData.tip) < 50) {
        setError("La propina mínima es de $50 MXN.");
        return;
    }
    setError(null);
    onSubmit({ ...formData, genre: formData.genre === 'otro' ? customGenre : formData.genre });
  };

  return (
    <Card className="w-full max-w-2xl bg-black/50 border-purple-400/30 text-white backdrop-blur-sm animate-fade-in-up">
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle className="text-3xl font-bold tracking-wider text-white">Solicita tu Canción</CardTitle>
          <CardDescription className="text-white/70 pt-1">Rellena el formulario para enviar tu solicitud de canción al DJ.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!isRequestTimeAllowed && (
            <Alert variant="destructive">
              <Terminal className="h-4 w-4" />
              <AlertTitle>Fuera de Horario</AlertTitle>
              <AlertDescription>{scheduleMessage}</AlertDescription>
            </Alert>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="songName">Nombre de la Canción</Label>
              <Input id="songName" placeholder="Ej: Bohemian Rhapsody" required disabled={!isRequestTimeAllowed} value={formData.songName} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="artistName">Artista</Label>
              <Input id="artistName" placeholder="Ej: Queen" required disabled={!isRequestTimeAllowed} value={formData.artistName} onChange={handleChange} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="genre">Género Musical</Label>
            <Select onValueChange={handleGenreChange} disabled={!isRequestTimeAllowed}>
              <SelectTrigger>
                <SelectValue placeholder="2. Selecciona tu método de pago (Stripe/Cripto)." />
              </SelectTrigger>
              <SelectContent>
                {
                  genres.map(genre => (
                    <SelectItem key={genre} value={genre.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-')}>
                      {genre}
                    </SelectItem>
                  ))
                }
              </SelectContent>
            </Select>
          </div>
          {showCustomGenre && (
            <div className="space-y-2">
              <Label htmlFor="customGenre">Especifica el Género</Label>
              <Input id="customGenre" placeholder="Ej: Cumbia" required value={customGenre} onChange={(e) => setCustomGenre(e.target.value)} disabled={!isRequestTimeAllowed} />
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div className="space-y-2">
                <Label htmlFor="requesterName">Tu Nombre</Label>
                <Input id="requesterName" placeholder="Tu nombre para el saludo" required disabled={!isRequestTimeAllowed} value={formData.requesterName} onChange={handleChange} />
            </div>
             <div className="space-y-2">
                <Label htmlFor="telegram">Usuario de Telegram (Opcional)</Label>
                <Input id="telegram" placeholder="@tuUsuario" disabled={!isRequestTimeAllowed} value={formData.telegram} onChange={handleChange} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="tip" className="flex items-center"><HeartHandshake className="mr-2 h-4 w-4 text-pink-400"/> Muestra tu apoyo (USD) *</Label>
            <Input id="tip" type="number" placeholder="$ 2.00" required min="2" disabled={!isRequestTimeAllowed} value={formData.tip} onChange={handleChange} />
<p className="text-xs text-muted-foreground pt-1">Desde $2.00 USD - Pequeño gesto que hace posible priorizar tu canción ✨</p>
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div className="flex items-center space-x-2">
            <Checkbox id="terms" checked={acceptedTerms} onCheckedChange={(checked) => setAcceptedTerms(checked as boolean)} disabled={!isRequestTimeAllowed} />
            <label htmlFor="terms" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Acepto los <a href="/terms" target="_blank" rel="noopener noreferrer" className="text-purple-400 underline hover:text-purple-300">términos y condiciones</a>
            </label>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-2 px-4 rounded-lg shadow-lg transition-transform transform hover:scale-105" disabled={!isRequestTimeAllowed || isSubmitting}>
            <Send className="mr-2 h-4 w-4" /> {isSubmitting ? 'Enviando...' : 'Enviar Mi Solicitud'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};
