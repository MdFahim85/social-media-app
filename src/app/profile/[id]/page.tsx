import { auth } from "@/auth";
import ProfileCard from "@/components/Profile/ProfileCard";

export default async function ProfilePage() {
  const session = await auth();
  const user = session?.user;
  if (user)
    return (
      <div>
        <ProfileCard />
      </div>
    );
  if (!user) return <div>No data available</div>;
}
