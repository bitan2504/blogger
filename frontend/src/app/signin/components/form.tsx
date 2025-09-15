"use client";
import axios from "axios";
import Link from "next/link";
import { useState } from "react";

export default function SignInForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const validateForm = () => {
    if (!email || !password) {
      setError("All fields are required");
      return false;
    }
    setError("");
    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateForm()) {
      console.log("Form submitted with:", { email, password });
      try {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/user/signin`,
          {
            email,
            password,
          },
          {
            withCredentials: true,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.data.success) {
          console.log("Sign-in successful:", response.data);
          window.location.href = "/";
        } else {
          setError(response.data.message || "Sign-in failed");
          console.error("Sign-in error:", response.data);
        }
      } catch (error) {
        console.error("Error during sign-in:", error);
        setError("An error occurred while signing in. Please try again.");
      }
    }
  };

  return (
    <div
      id="signin-form"
      className="flex flex-col gap-4 border border-gray-300 p-6 rounded-lg shadow-md"
    >
      <h2 id="signin-form-welcome-text" className="text-2xl font-bold">
        Welcome back!
      </h2>
      <h2 id="signin-form-error-text" className="text-red-500">
        {error && <p className="text-red-500">{`*${error}`}</p>}
      </h2>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 justify-center items-center"
      >
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="border border-zinc-600 rounded-md p-2 w-full"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="border border-zinc-600 rounded-md p-2 w-full"
        />
        <Link href="/signup" className="text-blue-500 hover:underline">
          {`Don't have an account? Sign up`}
        </Link>
        <button
          type="submit"
          className="bg-blue-500 text-white rounded-md py-2 px-4 max-w-fit cursor-pointer"
        >
          Sign In
        </button>
      </form>
    </div>
  );
}
