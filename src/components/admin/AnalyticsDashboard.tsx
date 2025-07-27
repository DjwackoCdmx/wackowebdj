import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { SongRequest } from '@/types';



interface AnalyticsDashboardProps {
  requests: SongRequest[];
}

const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ requests }) => {
  const analyticsData = useMemo(() => {
    if (!requests || requests.length === 0) {
      return { totalRevenue: 0, totalRequests: 0, dailyRevenue: [] };
    }

    const totalRevenue = requests.reduce((acc, req) => acc + req.tip_amount, 0);
    const totalRequests = requests.length;

    const dailyRevenueMap = requests.reduce((acc, req) => {
      const date = new Date(req.created_at).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' });
      acc[date] = (acc[date] || 0) + req.tip_amount;
      return acc;
    }, {} as Record<string, number>);

    const dailyRevenue = Object.entries(dailyRevenueMap)
      .map(([date, revenue]) => ({ date, Ingresos: revenue }))
      .sort((a, b) => new Date(a.date.split('/').reverse().join('-')).getTime() - new Date(b.date.split('/').reverse().join('-')).getTime());

    return { totalRevenue, totalRequests, dailyRevenue };
  }, [requests]);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ingresos Totales</CardTitle>
            <span className="text-2xl">💰</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${analyticsData.totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Suma de todas las propinas</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Solicitudes Totales</CardTitle>
            <span className="text-2xl">🎶</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.totalRequests}</div>
            <p className="text-xs text-muted-foreground">Total de canciones completadas</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Ingresos por Día</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analyticsData.dailyRevenue}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
              <Legend />
              <Bar dataKey="Ingresos" fill="#8884d8" name="Ingresos por Día" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsDashboard;
