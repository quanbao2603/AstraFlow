import Typewriter from '../../components/ui/Typewriter';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] w-full">
      <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight drop-shadow-2xl h-24 flex items-center">
        <Typewriter text="Chào mừng đến với AstraFlow" speed={80} delay={300} loop={true} loopDelay={3000} />
      </h1>
      <p className="mt-6 text-xl text-slate-300 drop-shadow-md">
        Nội dung Trang Chủ sẽ nằm ở đây!
      </p>
    </div>
  );
}
