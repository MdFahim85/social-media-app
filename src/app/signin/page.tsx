import { auth } from "@/auth";
import { SignIn } from "@/components/sign-in";
import { LoginButton } from "@/components/SignInButtons";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  const session = await auth();
  if (session) {
    return redirect("/");
  }
  return (
    <div className="flex items-center justify-center">
      <div className="rounded-2xl shadow-lg w-full flex flex-col items-center justify-center">
        <Card className="mb-4 w-xs sm:w-md">
          <CardTitle>
            <h1 className="text-3xl font-bold text-center">Welcome</h1>
          </CardTitle>
          <CardContent>
            <SignIn />
          </CardContent>
          <p className="text-center">Or</p>
          <CardContent>
            <div className="flex flex-col justify-center">
              <p className="text-center text-gray-600 mb-4">
                Sign in to your account using Google
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
                      Sign in with Google
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
              <p className="text-gray-500">Dont have an account ?</p>
              <Button variant={"link"} type="button">
                <Link href={"/signup"}>Sign Up</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
