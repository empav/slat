"use client";

import { useAuthActions } from "@convex-dev/auth/react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { SignFlow } from "../types";
import { useState } from "react";
import { TriangleAlert } from "lucide-react";

const SignCard = () => {
  const { signIn } = useAuthActions();
  const [signFlow, setSignFlow] = useState<SignFlow>("signIn");
  const [isPending, setIsPending] = useState(false);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");

  const onSign = (provider: "google" | "github") => {
    setIsPending(true);
    signIn(provider, { flow: signFlow })
      .catch(() => setError("Something went wrong"))
      .finally(() => setIsPending(false));
  };

  const onPassword = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (signFlow === "signUp" && password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    setIsPending(true);

    signIn("password", { name: fullName, email, password, flow: signFlow })
      .catch(() => setError("Something went wrong"))
      .finally(() => setIsPending(false));
  };

  return (
    <Card className="h-full w-full p-8">
      <CardHeader className="px-0 pt-0">
        <CardTitle>
          {signFlow === "signIn" ? "Login" : "Sign up"} to continue
        </CardTitle>
        <CardDescription>
          Use your email or another service to continue
        </CardDescription>
      </CardHeader>
      {error ? (
        <div className="flex items-center gap-x-2 bg-destructive/15 p-2 text-destructive text-sm rounded-md">
          <TriangleAlert className="size-4" /> {error}
        </div>
      ) : null}
      <CardContent className="space-y-5 px-0 pb-0">
        <form className="space-y-2.5" onSubmit={onPassword}>
          {signFlow === "signUp" ? (
            <Input
              disabled={isPending}
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              type="text"
              placeholder="Full name"
              required
            />
          ) : null}
          <Input
            disabled={isPending}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="Email"
            required
          />
          <Input
            disabled={isPending}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="Password"
            required
          />
          {signFlow === "signUp" ? (
            <Input
              disabled={isPending}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              type="password"
              placeholder="Confirm password"
              required
            />
          ) : null}
          <Button
            type="submit"
            className="w-full"
            disabled={isPending}
            size={"lg"}
          >
            Continue
          </Button>
        </form>
        <Separator />
        <div className="flex flex-col gap-y-2">
          <Button
            className="w-full relative"
            disabled={isPending}
            onClick={() => onSign("google")}
            variant={"outline"}
            size={"lg"}
          >
            <FcGoogle className="size-5 absolute top-2.5 left-2.5" />
            Continue with Google
          </Button>
          <Button
            className="w-full relative"
            disabled={isPending}
            onClick={() => onSign("github")}
            variant={"outline"}
            size={"lg"}
          >
            <FaGithub className="size-5 absolute top-2.5 left-2.5" />
            Continue with Github
          </Button>
          <p className="text-xs text-muted-foreground">
            {signFlow === "signIn" ? "Don&apos;t" : "Already"} have an account?{" "}
            <span
              className="text-sky-700 hover:underline cursor-pointer"
              onClick={() =>
                setSignFlow(signFlow === "signUp" ? "signIn" : "signUp")
              }
            >
              {signFlow === "signUp" ? "Sign In" : "Sign Up"}
            </span>
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default SignCard;
