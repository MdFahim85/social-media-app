import DesktopNav from "@/components/DesktopNav";
import Link from "next/link";

function Navbar() {
  return (
    <div className="sticky top-0 flex mb-4 px-20 py-4 border-b justify-between items-center dark:bg-neutral-950 bg-white ">
      <div className="font-bold text-xl">
        <Link href={"/"}>Social Media</Link>
      </div>
      <DesktopNav />
    </div>
  );
}

export default Navbar;
