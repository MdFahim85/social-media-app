"use client";

import { Button } from "./ui/button";
import { login, logout } from "@/lib/actions/auth.action";

function LoginButton({
  text,
  variant,
}: {
  text: string;
  variant:
    | "link"
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | null
    | undefined;
}) {
  return (
    <Button variant={variant} onClick={() => login()}>
      {text}
    </Button>
  );
}

function LogoutButton({ text }: { text: string }) {
  return <Button onClick={() => logout()}>{text}</Button>;
}

export { LoginButton, LogoutButton };
