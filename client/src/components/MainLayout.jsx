import { Outlet } from 'react-router-dom';
import Header from './Header';
import BottomNav from './BottomNav';
import NudgeNotification from './NudgeNotification';

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-surface flex flex-col max-w-md mx-auto relative">
      <Header />
      <main className="flex-1 overflow-y-auto pb-20 px-4">
        <Outlet />
      </main>
      <BottomNav />
      <NudgeNotification />
    </div>
  );
}
