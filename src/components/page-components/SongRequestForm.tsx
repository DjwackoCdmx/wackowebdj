import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { HeartHandshake, ListChecks, Send, Terminal } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";

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
  const scheduleMessage = useMemo(() => "El DJ no está aceptando solicitudes en este momento. Por favor, vuelve a intentarlo más tarde.", []);

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
      setFormData(prev => ({ ...prev, genre: "" }));
    } else {
      setShowCustomGenre(false);
      setCustomGenre("");
      setFormData(prev => ({ ...prev, genre: value }));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // Reset error on new submission

    if (!acceptedTerms) {
      setError("Debes aceptar los Términos y Condiciones para continuar.");
      return;
    }
    if (parseFloat(formData.tip) < 2) { // Assuming USD, min tip is 2
        setError("La propina mínima es de $2.00 USD.");
        return;
    }

    const finalFormData = { ...formData, genre: showCustomGenre ? customGenre : formData.genre };
    onSubmit(finalFormData);
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
                <SelectValue placeholder="Selecciona un género musical" />
              </SelectTrigger>
              <SelectContent>
                {genres.map(genre => (
                  <SelectItem key={genre} value={genre.toLowerCase().replace(/\s&\s/g, '-').replace(/\s/g, '-')}>
                    {genre}
                  </SelectItem>
                ))}
                 <SelectItem value="otro">Otro (especificar)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {showCustomGenre && (
            <div className="space-y-2 animate-fade-in">
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
          <div className="mt-4">
            <Label htmlFor="tip" className="flex items-center text-lg font-semibold mb-2 text-white"><HeartHandshake className="mr-2 text-pink-400"/> Muestra tu apoyo (USD) *</Label>
            <Input id="tip" type="number" placeholder="$ 2.00" required min="2" step="0.01" disabled={!isRequestTimeAllowed} value={formData.tip} onChange={handleChange} />
            <p className="text-sm text-muted-foreground mt-1">
              Desde $2.00 USD - Pequeño gesto que hace posible priorizar tu canción ✨
            </p>
          </div>

          {/* Next steps and terms */}
          <div className="mt-6 bg-muted/20 p-4 rounded-lg border border-border/30">
            <h4 className="font-semibold text-foreground flex items-center"><ListChecks className="w-4 h-4 mr-2"/> Próximos pasos:</h4>
            <ol className="list-decimal list-inside text-sm text-muted-foreground mt-2 space-y-1">
              <li>Completa el formulario y asegúrate de aceptar los términos y condiciones.</li>
              <li>Tu solicitud aparecerá en la lista de espera para que DJ la vea.</li>
              <li>Sube evidencia de pago (usa whatsapp con el nombre que colocaste).</li>
              <li>¡Espera confirmación y disfruta de tu canción!</li>
            </ol>
          </div>
          
          <div className="flex items-center space-x-2 mt-4">
            <Checkbox id="terms" checked={acceptedTerms} onCheckedChange={(checked) => setAcceptedTerms(checked as boolean)} disabled={!isRequestTimeAllowed} />
            <label htmlFor="terms" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Acepto los <a href="/terms" target="_blank" rel="noopener noreferrer" className="text-purple-400 underline hover:text-purple-300">términos y condiciones</a>
            </label>
          </div>
          {error && <Alert variant="destructive" className="mt-4"><Terminal className="h-4 w-4" /><AlertTitle>Error de Validación</AlertTitle><AlertDescription>{error}</AlertDescription></Alert>}
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 text-lg rounded-lg shadow-lg transition-transform transform hover:scale-105" disabled={!isRequestTimeAllowed || isSubmitting}>
            <Send className="mr-2 h-5 w-5" /> {isSubmitting ? 'Enviando...' : 'Enviar Mi Solicitud'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};
