"use client";

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

const SignCard = () => {
  const [signFlow, setSignFlow] = useState<SignFlow>("signUp");

  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");

  return (
    <Card className="h-full w-full p-8">
      <CardHeader className="px-0 pt-0">
        <CardTitle>
          {signFlow === "signIn" ? "Login" : "Sign up"} to continue
        </CardTitle>
      </CardHeader>
      <CardDescription>
        Use your email or another service to continue
      </CardDescription>
      <CardContent className="space-y-5 px-0 pb-0">
        <form className="space-y-2.5">
          <Input
            disabled={false}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="Email"
            required
          />
          <Input
            disabled={false}
            value={pwd}
            onChange={(e) => setPwd(e.target.value)}
            type="password"
            placeholder="Password"
            required
          />
          {signFlow === "signUp" ? (
            <Input
              disabled={false}
              value={confirmPwd}
              onChange={(e) => setConfirmPwd(e.target.value)}
              type="password"
              placeholder="Confirm password"
              required
            />
          ) : null}
          <Button type="submit" className="w-full" disabled={false} size={"lg"}>
            Continue
          </Button>
        </form>
        <Separator />
        <div className="flex flex-col gap-y-2">
          <Button
            className="w-full relative"
            disabled={false}
            onClick={() => {}}
            variant={"outline"}
            size={"lg"}
          >
            <FcGoogle className="size-5 absolute top-2.5 left-2.5" />
            Continue with Google
          </Button>
          <Button
            className="w-full relative"
            disabled={false}
            onClick={() => {}}
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
