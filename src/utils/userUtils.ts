import { z } from "zod";
import { User } from "../entities/User";

export const userSchema = z.object({
  email: z
    .string()
    .email({ message: "O email deve ser um email válido." })
    .min(1, { message: "O email é obrigatório." }),
  password: z
    .string()
    .min(8, { message: "A senha deve ter pelo menos 8 caracteres." })
    .max(100, { message: "A senha não pode ter mais de 100 caracteres." })
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?])[A-Za-z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]{8,}$/,
      "A senha deve conter pelo menos uma letra maiúscula, uma minúscula, um número e um caractere especial."
    ),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export const convertToUser = (userDoc: any): User => {
  const user = new User(
    {
      email: userDoc.email,
      password: userDoc.password,
      createdAt: userDoc.createdAt,
      updatedAt: userDoc.updatedAt,
    },
    userDoc._id.toString()
  );

  return user;
};
