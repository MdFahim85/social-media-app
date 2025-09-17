import Sidebar from "@/components/Homepage/Sidebar";
import Home from "@/components/Homepage/Home";

export default function Homepage() {
  return (
    <div className="flex container">
      <div className="grid grid-cols-12 gap-4 w-full">
        <div className="col-span-12 lg:col-span-3">
          <Sidebar />
        </div>
        <div className="col-span-12 lg:col-span-6">
          <Home />
        </div>
        <div className="col-span-12 lg:col-span-3">follow suggestions</div>
      </div>
    </div>
  );
}
