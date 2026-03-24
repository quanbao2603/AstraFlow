import Typewriter from '../../components/ui/Typewriter';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] w-full px-4 text-center">
      <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight drop-shadow-2xl h-24 flex items-center justify-center">
        <Typewriter
          text="Chào mừng đến với AstraFlow"
          speed={80}
          delay={300}
          loop={true}
          loopDelay={3000}
          highlightWord="AstraFlow"
          highlightClassName="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 font-extrabold"
        />
      </h1>
      <p className="mt-6 text-xl text-slate-300 drop-shadow-md max-w-5xl leading-relaxed">
        Hãy bước vào thế giới vô tận của AstraFlow – nơi AI khơi dậy những giấc mơ hoang đường<br className="hidden md:block" />
        cùng bạn dệt nên cuộc phiêu lưu không giới hạn, từ ý tưởng mơ hồ đến kiệt tác bất tận
      </p>
    </div>
  );
}