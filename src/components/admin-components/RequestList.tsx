import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Play, CheckCircle2, Trash2, Clock, DollarSign, MessageSquare, User as UserIcon } from 'lucide-react';
import type { SongRequest } from '@/types';

interface RequestListProps {
  requests: SongRequest[];
  onPlay: (id: string) => void;
  onFinish: (id: string) => void;
  onDelete: (id: string) => void;
}

const RequestList = ({ requests, onPlay, onFinish, onDelete }: RequestListProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Cola de Solicitudes</CardTitle>
        <CardDescription>Canciones pendientes y en reproducción.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {requests.length === 0 ? (
          <p className="text-muted-foreground text-center">No hay solicitudes pendientes.</p>
        ) : (
          requests.map((request) => (
            <Card key={request.id} className={`p-4 flex items-center justify-between ${request.played_status === 'playing' ? 'bg-primary/10 border-primary' : ''}`}>
              <div>
                <p className="font-bold text-lg">{request.song_name}</p>
                <p className="text-sm text-muted-foreground">{request.artist_name}</p>
                <div className="flex items-center flex-wrap gap-4 mt-2 text-xs text-muted-foreground">
                  <Badge variant={request.tip_amount > 0 ? 'default' : 'secondary'} className="flex items-center gap-1">
                    <DollarSign className="w-3 h-3" />
                    {request.tip_amount.toFixed(2)}
                  </Badge>
                  {request.requester_name && (
                    <span className="flex items-center gap-1"><UserIcon className="w-3 h-3" /> {request.requester_name}</span>
                  )}
                  {request.telegram_username && (
                    <span className="flex items-center gap-1"><MessageSquare className="w-3 h-3" /> @{request.telegram_username}</span>
                  )}
                   <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(request.created_at).toLocaleTimeString()}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                {request.played_status === 'pending' && (
                  <Button size="sm" onClick={() => onPlay(request.id)}>
                    <Play className="w-4 h-4 mr-2" />
                    Reproducir
                  </Button>
                )}
                {request.played_status === 'playing' && (
                  <Button size="sm" onClick={() => onFinish(request.id)}>
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Finalizar
                  </Button>
                )}
                <Button variant="destructive" size="sm" onClick={() => onDelete(request.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          ))
        )}
      </CardContent>
    </Card>
  );
};

export default RequestList;
