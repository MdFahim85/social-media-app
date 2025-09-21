import NotificationCards from "../../components/Notifications/NotificationCards";

function Notification() {
  return (
    <div>
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 md:col-span-12">
          <NotificationCards />
        </div>
      </div>
    </div>
  );
}

export default Notification;
