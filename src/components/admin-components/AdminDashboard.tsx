import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import RequestList from './RequestList';
import HistoryList from './HistoryList';
import OnlineUsersList from './OnlineUsersList';
import AnalyticsDashboard from './AnalyticsDashboard';
import type { SongRequest, UserProfile } from '@/types';

interface AdminDashboardProps {
  requests: SongRequest[];
  history: SongRequest[];
  onlineUsers: UserProfile[];
  onPlay: (id: string) => void;
  onFinish: (id: string) => void;
  onDelete: (id: string) => void;
}

const AdminDashboard = ({ requests, history, onlineUsers, onPlay, onFinish, onDelete }: AdminDashboardProps) => {
  return (
    <Tabs defaultValue="requests" className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="requests">Solicitudes ({requests.length})</TabsTrigger>
        <TabsTrigger value="history">Historial ({history.length})</TabsTrigger>
        <TabsTrigger value="users">Usuarios ({onlineUsers.length})</TabsTrigger>
        <TabsTrigger value="analytics">Analíticas</TabsTrigger>
      </TabsList>
      <TabsContent value="requests">
        <RequestList requests={requests} onPlay={onPlay} onFinish={onFinish} onDelete={onDelete} />
      </TabsContent>
      <TabsContent value="history">
        <HistoryList history={history} />
      </TabsContent>
      <TabsContent value="users">
        <OnlineUsersList users={onlineUsers} />
      </TabsContent>
      <TabsContent value="analytics">
        <AnalyticsDashboard requests={requests} />
      </TabsContent>
    </Tabs>
  );
};

export default AdminDashboard;
