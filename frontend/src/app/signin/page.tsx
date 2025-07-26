import SignInForm from "./components/form";
import Image from "next/image";

export default function SignInPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div id="signin-logo-container" className="flex flex-row justify-center items-center rounded-full">
        <Image src="/img/navbar.png" alt="logo" width={60} height={60} className="rounded-full" />
        <h2 className="text-center text-4xl font-bold">blogger</h2>
      </div>
      <div id="signin-form-container" className="p-8 rounded-lg shadow-md w-full max-w-md">
        <SignInForm />
      </div>
    </div>
  );
}
