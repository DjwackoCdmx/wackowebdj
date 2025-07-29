import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User as UserIcon, Phone } from 'lucide-react';
import type { UserProfile } from '@/types';

interface OnlineUsersListProps {
  users: UserProfile[];
}

const OnlineUsersList = ({ users }: OnlineUsersListProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Usuarios en Línea</CardTitle>
        <CardDescription>Usuarios activos en los últimos 30 minutos.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {users.length === 0 ? (
          <p className="text-muted-foreground text-center">No hay usuarios activos.</p>
        ) : (
          users.map((profile) => (
            <div key={profile.user_id} className="flex items-center gap-3 p-2 rounded-md bg-card/50">
              <Avatar>
                <AvatarFallback>
                  {profile.name ? profile.name.charAt(0).toUpperCase() : <UserIcon className="w-4 h-4" />}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold">{profile.name}</p>
                {profile.phone && (
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Phone className="w-3 h-3" />
                    {profile.phone}
                  </p>
                )}
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};

export default OnlineUsersList;
