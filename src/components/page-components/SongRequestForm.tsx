import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
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
  isRequestTimeAllowed: boolean;
  scheduleMessage: string;
  onSubmit: (formData: SongRequestFormData, customGenre: string) => void;
  isSubmitting: boolean;
}

export const SongRequestForm = ({ isRequestTimeAllowed, scheduleMessage, onSubmit, isSubmitting }: SongRequestFormProps) => {
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
      setError("Debes aceptar los términos y condiciones para continuar.");
      return;
    }
    if (parseFloat(formData.tip) < 50) {
        setError("La propina mínima es de $50 MXN.");
        return;
    }
    setError(null);
    onSubmit(formData, customGenre);
  };

  return (
    <Card className="w-full bg-black/50 border-purple-400/30 text-white backdrop-blur-sm">
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle className="text-2xl font-bold tracking-wider text-purple-300">Solicita tu Canción</CardTitle>
          <CardDescription className="text-gray-400">Rellena el formulario para enviar tu solicitud de canción al DJ.</CardDescription>
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
                <SelectValue placeholder="Selecciona un género" />
              </SelectTrigger>
              <SelectContent>
                {
                  [
                    "Reggaeton", "Techno", "House", "Electro", "EDM", "Hip-Hop", "Trap", 
                    "Pop", "Rock", "Cumbia", "Salsa", "Bachata", "Merengue", "Regional Mexicano",
                    "Funk", "Disco", "Trance", "Dubstep", "Drum & Bass", "Ambient", "Progressive",
                    "Deep House", "Tech House", "Minimal", "Banda", "Circuit", "Otro"
                  ].map(genre => (
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
            <Label htmlFor="tip">Propina (MXN)</Label>
            <Input id="tip" type="number" placeholder="Mínimo $50 MXN" required min="50" disabled={!isRequestTimeAllowed} value={formData.tip} onChange={handleChange} />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div className="flex items-center space-x-2">
            <Checkbox id="terms" checked={acceptedTerms} onCheckedChange={(checked) => setAcceptedTerms(checked as boolean)} disabled={!isRequestTimeAllowed} />
            <label htmlFor="terms" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Acepto los{" "}
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="link" className="p-0 h-auto text-purple-400">términos y condiciones</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Términos y Condiciones</DialogTitle>
                    <DialogDescription className="text-gray-300 pt-4">
                      <p>1. La propina mínima es de $50 MXN.</p>
                      <p>2. El DJ se reserva el derecho de no poner la canción si no la tiene o no encaja con el mood del evento.</p>
                      <p>3. En caso de no poner la canción, se reembolsará la propina.</p>
                    </DialogDescription>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
            </label>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700" disabled={!isRequestTimeAllowed || isSubmitting}>
            {isSubmitting ? "Procesando..." : "Enviar Solicitud"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};
