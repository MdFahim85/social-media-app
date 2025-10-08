import DesktopNav from "@/components/DesktopNav";
import MobileNav from "@/components/MobileNav";
import Link from "next/link";

function Navbar() {
  return (
    <div className="sticky top-0 flex mb-4 py-4 px-4 md:px-20 border-b justify-between items-center dark:bg-neutral-950 bg-white z-50">
      <div className="font-bold text-xl">
        <Link href={"/"}>Socially</Link>
      </div>

      {/* Desktop Navigation - hidden on mobile */}
      <div className="hidden md:block">
        <DesktopNav />
      </div>

      {/* Mobile Navigation - shown only on mobile */}
      <div className="md:hidden">
        <MobileNav />
      </div>
    </div>
  );
}

export default Navbar;
