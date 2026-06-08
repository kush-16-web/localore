import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex flex-col h-screen">
                <Header />

            <div className="flex-1 flex overflow-hidden">
            <Sidebar />

                <main className="flex-1 bg-[#140C08] overflow-x-hidden overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    )
}