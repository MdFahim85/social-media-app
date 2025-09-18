import Sidebar from "@/components/Homepage/Sidebar";
import NotificationCards from "../../components/Notifications/NotificationCards";

function Notification() {
  return (
    <div>
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 md:col-span-4">
          <Sidebar />
        </div>
        <div className="col-span-12 md:col-span-8">
          <NotificationCards />
        </div>
      </div>
    </div>
  );
}

export default Notification;
