import Sidebar from "./components/Sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-1 h-screen">
      <Sidebar />
      <main className="w-full">{children}</main>
    </div>
  )
}