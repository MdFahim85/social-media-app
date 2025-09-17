import DesktopNav from "@/components/DesktopNav";
import Link from "next/link";

function Navbar() {
  return (
    <div className="sticky top-0 flex mb-4 px-20 py-4 justify-between items-center dark:bg-slate-950 bg-white border-b border-slate-950 dark:border-white">
      <div className="font-bold text-xl">
        <Link href={"/"}>Social Media</Link>
      </div>
      <DesktopNav />
    </div>
  );
}

export default Navbar;
