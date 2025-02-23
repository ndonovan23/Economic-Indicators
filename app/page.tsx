import TreasuryDashboard from './components/TreasuryDashboard';


export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-24 bg-gray-100">
      <div className="w-full max-w-7xl">
        <TreasuryDashboard />
      </div>
    </main>
  );
}
