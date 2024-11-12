import { z } from 'zod';
import { User } from '../entities/User';
import { capitalize, normalizeSpaces } from './stringUtils';

export const userSchema = z.object({
  name: z
    .string({
      required_error: 'O nome é obrigatório.',
      invalid_type_error: 'O nome deve ser uma string.',
    })
    .min(3, { message: 'O nome deve ter pelo menos 3 caracteres.' })
    .max(100, { message: 'O nome deve ter no máximo 100 caracteres.' })
    .trim()
    .transform(normalizeSpaces)
    .transform(capitalize),
  email: z
    .string()
    .email({ message: 'Email inválido.' })
    .min(1, { message: 'O email é obrigatório.' }),
  password: z
    .string()
    .min(8, {
      message:
        'A senha deve ter pelo menos 8 caracteres, com uma maiúscula, uma minúscula, um número e um símbolo.',
    })
    .max(100, { message: 'A senha não pode ter mais de 100 caracteres.' })
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?])[A-Za-z\d!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]{8,}$/,
      'A senha deve ter pelo menos 8 caracteres, com uma maiúscula, uma minúscula, um número e um símbolo.'
    ),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const convertToUser = (userDoc: any): User => {
  const user = new User(
    {
      name: userDoc.name,
      email: userDoc.email,
      password: userDoc.password,
      createdAt: userDoc.createdAt,
      updatedAt: userDoc.updatedAt,
    },
    userDoc._id.toString()
  );

  return {
    ...user,
    id: userDoc._id.toString(),
  };
};
