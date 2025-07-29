import logo from '@/assets/dj-wacko-main-logo.gif';

const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background">
      <img src={logo} alt="DJ Wacko Logo" className="w-40 h-40 mb-4" />
      <p className="text-xl font-semibold text-white animate-pulse">Cargando la experiencia...</p>
    </div>
  );
};

export default LoadingScreen;
