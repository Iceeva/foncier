import SiteHeader from "@/components/layout/site-header";
import SiteFooter from "@/components/layout/site-footer";
export default function LayoutPublic({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-fond">
      <SiteHeader />
      <main id="contenu" className="mx-auto w-full max-w-6xl flex-1 px-6 py-8">{children}</main>
      <SiteFooter />
    </div>
  );
}
