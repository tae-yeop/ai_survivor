import { AdminQuickActions } from "@/components/admin/AdminQuickActions";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { Preloader } from "@/components/layout/preloader";

export default function PublicLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex min-h-screen flex-col">
      <Preloader />
      <a href="#main" className="skip-link">
        본문으로 건너뛰기
      </a>
      <Header />
      <main id="main" className="flex-1 pt-16">
        {children}
      </main>
      <AdminQuickActions />
      <Footer />
    </div>
  );
}
