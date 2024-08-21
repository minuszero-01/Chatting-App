import prisma from "@/prisma";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcrypt";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        name: {
          label: "Name",
          type: "text",
          placeholder: "John Doe",
          required: true,
        },
        email: {
          label: "Email Address",
          type: "text",
          placeholder: "johndoe@gmail.com",
          required: true,
        },
        password: {
          label: "Password",
          type: "password",
          required: true,
        },
      },

      async authorize(credentials: any) {
        const { email, password } = credentials;
        const hashedPassword = await bcrypt.hash(credentials.password, 10);
        const existingUser = await prisma.user.findFirst({
          where: {
            email: email,
          },
        });

        if (existingUser) {
          const passwordValidate = await bcrypt.compare(
            password,
            existingUser.password
          );

          if (passwordValidate) {
            return {
              id: existingUser.id.toString(),
              name: existingUser.name,
              email: existingUser.email,
            };
          } else {
            console.log("Password Validation Went Wrong");
            return null;
          }
        }
        try {
          const user = await prisma.user.create({
            data: {
              name: credentials.name,
              email: credentials.email,
              password: hashedPassword,
            },
          });

          console.log("User Created: ", user.email);

          return {
            id: user.id.toString(),
            name: user.name,
            email: user.email,
          };
        } catch (e) {
          console.log("Error in Authentication while creating New User");
          console.error(e);
        }

        return null;
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET || "secret",
  callbacks: {
    async session({ token, session }: any) {
      session.user.id = token.sub;

      return session;
    },
  },
};
