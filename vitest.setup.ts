import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock de ResizeObserver para las pruebas de recharts
const ResizeObserverMock = vi.fn(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

vi.stubGlobal('ResizeObserver', ResizeObserverMock);
