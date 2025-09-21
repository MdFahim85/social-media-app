import Home from "@/components/Homepage/Home";

export default function Homepage() {
  return (
    <div className="flex container">
      <div className="grid grid-cols-12 gap-4 w-full">
        <div className="col-span-12 lg:col-span-4">follow suggestions</div>
        <div className="col-span-12 lg:col-span-8">
          <Home />
        </div>
      </div>
    </div>
  );
}
