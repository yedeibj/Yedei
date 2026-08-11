import AdminSidebar from "./AdminSidebar";
import LogoutButton from "./LogoutButton";

export default function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#F6F3EC]">
      <AdminSidebar />
      <div className="flex-1">
        <header className="flex items-center justify-end border-b border-[#D8D3C9] bg-white px-8 py-4">
          <LogoutButton />
        </header>
        <div className="px-8 py-8">{children}</div>
      </div>
    </div>
  );
}
