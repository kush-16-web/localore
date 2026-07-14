import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import RightPanel from './RightPanel';
import { useGemPanel } from '../../context/GemPanelContext';

export default function Layout({ children }: { children: React.ReactNode }) {
  const { selectedGem, closePanel } = useGemPanel();

  return (
    <div className="flex flex-col h-screen">
      <Header />
      <div className="flex-1 flex overflow-hidden">
        <Sidebar />
        {/* Main content — shrinks naturally when RightPanel is open */}
        <main className="flex-1 bg-[#140C08] overflow-hidden">
          {children}
        </main>
        {/* RightPanel — frame-level sibling of main, just like Sidebar */}
        <RightPanel
          gem={selectedGem}
          onClose={closePanel}
          isOpen={Boolean(selectedGem)}
        />
      </div>
    </div>
  );
}