import PublicLayout from './layouts/PublicLayout';

function App() {
  return (
    <PublicLayout>
      <div className="flex flex-col items-center justify-center min-h-[80vh] w-full">
        <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight drop-shadow-2xl">
          Chào mừng đến với AstraFlow
        </h1>
        <p className="mt-6 text-xl text-slate-300 drop-shadow-md">
          Nội dung Trang Chủ sẽ nằm ở đây!
        </p>
      </div>
    </PublicLayout>
  );
}

export default App;