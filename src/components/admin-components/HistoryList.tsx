import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, DollarSign, User as UserIcon } from 'lucide-react';
import type { SongRequest } from '@/types';

interface HistoryListProps {
  history: SongRequest[];
}

const HistoryList = ({ history }: HistoryListProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Historial</CardTitle>
        <CardDescription>Canciones reproducidas recientemente.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {history.length === 0 ? (
          <p className="text-muted-foreground text-center">El historial está vacío.</p>
        ) : (
          history.map((request) => (
            <Card key={request.id} className="p-3 bg-card/50">
              <p className="font-semibold">{request.song_name}</p>
              <p className="text-sm text-muted-foreground">{request.artist_name}</p>
              <div className="flex items-center flex-wrap gap-3 mt-2 text-xs text-muted-foreground">
                <Badge variant={request.tip_amount > 0 ? 'default' : 'secondary'} className="flex items-center gap-1">
                  <DollarSign className="w-3 h-3" />
                  {request.tip_amount.toFixed(2)}
                </Badge>
                {request.requester_name && (
                  <span className="flex items-center gap-1"><UserIcon className="w-3 h-3" /> {request.requester_name}</span>
                )}
                {request.played_at && (
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(request.played_at).toLocaleTimeString()}
                  </span>
                )}
              </div>
            </Card>
          ))
        )}
      </CardContent>
    </Card>
  );
};

export default HistoryList;
