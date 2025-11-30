import Sidebar from "./components/Sidebar";
import Header from "./components/Header";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-screen bg-[#0A0E18] text-white">
            <Sidebar />
            <div className="flex flex-1 flex-col overflow-hidden">
                <Header />
                <main className="flex-1 overflow-y-auto p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
