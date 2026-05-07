import prisma from "../config/db";
import { AppError } from "../utils/appError";
import bcrypt from "bcrypt";

export async function registerUser(email: string, password: string) {
  // Check if user already exsists
  const userFound = await prisma.user.findUnique({
    where: { email: email },
  });

  if (userFound) {
    throw new AppError("User already exsist", 409);
  }

  // Hashing the password
  const salt = await bcrypt.genSalt(12);
  const hashPassword = await bcrypt.hash(password, salt);

  // DB Storing
  const result = await prisma.$transaction(async (tx) => {
    // add user to db
    const addUser = await tx.user.create({
      data: { email: email, passwordHash: hashPassword },
    });

    //get role
    const role = await tx.role.findUnique({ where: { name: "user" } });

    if (!role) {
      throw new AppError("Role Not Found", 404);
    }

    // link user to role
    await tx.userRole.create({
      data: { userId: addUser.id, roleId: role.id },
    });

    const newUser = {
      userId: addUser.id,
      email: addUser.email,
      role: role.name,
    };

    return newUser;
  });

  return result;
}
