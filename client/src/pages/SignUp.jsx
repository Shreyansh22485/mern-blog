import { Button, Label, TextInput } from "flowbite-react";
import React from "react";
import { Link } from "react-router-dom";

const SignUp = () => {
  return (
    <div className="min-h-screen mt-20">
      <div className="flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5">
        <div className="flex-1">
          {/* left side */}
          <Link to="/" className="text-4xl font-bold dark:text-white">
            <span className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white">
              Bhallu's
            </span>
            Blog
          </Link>
          <p className="text-sm mt-5">
            lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam
            nesciunt voluptas quia, eaque ipsa temporibus dol
          </p>
        </div>
        <div className="flex-1">
          {/* right side */}
          <form className="flex flex-col gap-4">
            <div>
              <Label value="Your Username"></Label>
              <TextInput
                type="text"
                placeholder="Username"
                id="username"
                // className="mt-1 block w-full rounded-md shadow-sm border text-gray-700 focus:border-purple-500 focus:ring focus:ring-purple-500 focus:ring-opacity-50"
              ></TextInput>
            </div>
            <div>
              <Label value="Your Email"></Label>
              <TextInput
                type="email"
                placeholder="Email"
                id="email"
                className="w-full"
              ></TextInput>
            </div>
            <div>
              <Label value="Your Password"></Label>
              <TextInput
                type="password"
                placeholder="Password"
                id="password"
                className="w-full"
              ></TextInput>
            </div>
            <Button gradientDuoTone={"purpleToPink"} pill>Sign Up</Button>
          </form>
          <div>
            <p className="text-sm mt-5">
              Already have an account?{" "}
              <Link to="/sign-in" className="text-blue-500">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
