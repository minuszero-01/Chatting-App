"use client";

import { FC, useState } from "react";
import { Button } from "./ui/button";
import { addFriendValidator } from "@/lib/validations/add-friend";
import axios, { AxiosError } from "axios";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast, { Toaster } from "react-hot-toast";

type FormData = z.infer<typeof addFriendValidator>;

const AddFriend = () => {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(addFriendValidator),
  });

  const addFriend = async (email: string) => {
    try {
      const validatedEmail = addFriendValidator.parse({ email });

      await axios.post("/api/friends/add", {
        email: validatedEmail,
      });

      toast.success("Friend Request Sent");
    } catch (error) {
      if (error instanceof z.ZodError) {
        setError("email", { message: error.message });
        toast.error(error.message);
        return;
      }

      if (error instanceof AxiosError) {
        setError("email", { message: error.response?.data });
        toast.error(error.response?.data);
        return;
      }
    }
  };

  const onSubmit = (data: FormData) => {
    addFriend(data.email);
  };

  return (
    <div className="w-max p-4 ">
      <div className="text-2xl font-medium leading-10">Add Friend</div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label className="text-sm block font-medium leading-6 text-gray-900 ">
          Enter Your Friend email
        </label>
        <div className="mt-2 flex flex-row   gap-2">
          <input
            {...register("email")}
            type="text"
            placeholder="johndoe@gmail.com"
            className="p-2 rounded-lg block w-full border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-accent sm:text-sm sm:leading-6 "
          />
          <Button type="submit" className="">
            Add
          </Button>
        </div>
      </form>
      <Toaster position="top-right" reverseOrder={false} />
    </div>
  );
};

export default AddFriend;
