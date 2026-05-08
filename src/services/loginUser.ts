import prisma from "../config/db";
import { AppError } from "../utils/appError";
import bcrypt from "bcrypt";
export async function userLogin(email: string, password: string) {
  // Check if user exsist or not
  const findUser = await prisma.user.findUnique({
    where: { email: email },
    include: { roles: { include: { role: true } } },
  });

  if (!findUser) {
    throw new AppError("Invalid email or password", 401);
  }

  // Compare password
  const comparePassword = await bcrypt.compare(password, findUser.passwordHash);

  if (!comparePassword) {
    throw new AppError("Invalid email or password", 401);
  }

  const roles = findUser.roles.map((role) => role.role.name);

  const user = {
    userId: findUser.id,
    email: findUser.email,
    roles: roles,
  };

  return user;
}
