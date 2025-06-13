// Admin layout with sidebar/header
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <aside>Sidebar</aside>
      <main>{children}</main>
    </div>
  );
}
