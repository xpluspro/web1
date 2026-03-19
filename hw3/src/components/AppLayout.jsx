import SiteFooter from './SiteFooter.jsx';
import SiteHeader from './SiteHeader.jsx';

export default function AppLayout({ children, cartCount, searchTerm, onSearchChange }) {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <SiteHeader
        cartCount={cartCount}
        searchTerm={searchTerm}
        onSearchChange={onSearchChange}
      />
      <main>{children}</main>
      <SiteFooter />
    </div>
  );
}
