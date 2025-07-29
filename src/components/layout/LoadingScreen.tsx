import logo from '@/assets/dj-wacko-main-logo.gif';

const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/95 backdrop-blur-sm animate-fade-in">
      <div className="relative mb-8 animate-[zoomIn_0.8s_cubic-bezier(0.25,1,0.5,1)]">
        <div className="absolute -inset-2 rounded-full bg-primary/50 animate-[glow_2.5s_ease-in-out_infinite]" />
        <img src={logo} alt="DJ Wacko Logo" className="relative w-40 h-40 rounded-full" />
      </div>
      
      <p className="text-xl font-semibold text-white mb-6 animate-[pulse_2s_ease-in-out_infinite]">
        Cargando la experiencia...
      </p>

      <div className="w-64 h-2 bg-white/10 rounded-full overflow-hidden">
        <div className="h-full bg-primary rounded-full animate-[progress_2s_linear_infinite]"></div>
      </div>
    </div>
  );
};

export default LoadingScreen;
