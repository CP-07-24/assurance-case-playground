import MainLayout from './components/layout/MainLayout';
import { DiagramProvider } from './context/DiagramContext';

export default function App() {
  return (
    <DiagramProvider>
      <MainLayout />
    </DiagramProvider>
  );
}