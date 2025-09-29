import { auth } from "@/auth";
import SignUpComp from "@/components/sign-up";
import { LoginButton } from "@/components/SignInButtons";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

async function SignUp() {
  const session = await auth();
  if (session) {
    return redirect("/");
  }
  return (
    <div className="flex justify-center">
      <Card className="w-xs sm:w-md mb-4">
        <CardHeader>
          <CardTitle>
            <h1 className="text-3xl font-bold text-center">Register</h1>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <SignUpComp />
        </CardContent>
        <CardContent>
          <div className="flex flex-col justify-center">
            <p className="text-center text-gray-600 mb-4">
              Sign up using your Google account
            </p>
            <LoginButton
              text={
                <>
                  {" "}
                  <Image
                    src="/google.svg"
                    alt="Google"
                    width={24}
                    height={24}
                  />
                  <span className="font-medium text-gray-400">
                    Sign up with Google
                  </span>
                </>
              }
              variant={"secondary"}
            />
          </div>
        </CardContent>
        <CardContent>
          {" "}
          <div className="flex items-center justify-center">
            <p className="text-gray-500">Already have an account ?</p>
            <Button variant={"link"} type="button">
              <Link href={"/signin"}>Sign In</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default SignUp;
