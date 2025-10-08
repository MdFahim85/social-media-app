import UpdateCard from "@/components/Profile/UpdateCard";
import { Card, CardContent, CardTitle } from "@/components/ui/card";

export default async function UpdatePage() {
  return (
    <div className="flex justify-center mb-4">
      <Card className="w-xs sm:w-full">
        <CardTitle>
          <div className="text-center text-2xl">Update your profile</div>
        </CardTitle>
        <CardContent>
          <UpdateCard />
        </CardContent>
      </Card>
    </div>
  );
}
