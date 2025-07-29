import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import AnalyticsDashboard from './AnalyticsDashboard';
import type { SongRequest } from '@/types';

// Datos de prueba simulados
const mockRequests: SongRequest[] = [
  {
    id: '1', song_name: 'Test Song 1', artist_name: 'Artist 1', tip_amount: 10, created_at: '2023-10-26T10:00:00Z', payment_status: 'paid', played_status: 'completed',
  },
  {
    id: '2', song_name: 'Test Song 2', artist_name: 'Artist 2', tip_amount: 20, created_at: '2023-10-26T11:00:00Z', payment_status: 'paid', played_status: 'completed',
  },
  {
    id: '3', song_name: 'Test Song 3', artist_name: 'Artist 3', tip_amount: 15, created_at: '2023-10-27T12:00:00Z', payment_status: 'paid', played_status: 'completed',
  },
];

describe('AnalyticsDashboard Component', () => {
  it('should render KPI cards with correct total revenue and request count', () => {
    render(<AnalyticsDashboard requests={mockRequests} />);

    // Verificar Ingresos Totales (10 + 20 + 15 = 45)
    expect(screen.getByText('$45.00')).toBeInTheDocument();

    // Verificar Solicitudes Totales
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('should render correctly with no requests', () => {
    render(<AnalyticsDashboard requests={[]} />);

    // Verificar que los valores sean 0 cuando no hay datos
    expect(screen.getByText('$0.00')).toBeInTheDocument();
    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('should display the chart title', () => {
    render(<AnalyticsDashboard requests={mockRequests} />);
    expect(screen.getByText('Ingresos por Día')).toBeInTheDocument();
  });
});
