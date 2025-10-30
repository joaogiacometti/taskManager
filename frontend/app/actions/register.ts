import z from "zod";
import { Result } from "../types/result";

export const registerSchema = z.object({
  email: z.email("E-mail inválido"),
  password: z
    .string()
    .min(6, "A senha deve ter pelo menos 6 caracteres.")
    .regex(
      /[A-Z]/,
      "A senha deve ter pelo menos uma letra maiúscula ('A'-'Z')."
    )
    .regex(
      /[a-z]/,
      "A senha deve ter pelo menos uma letra minúscula ('a'-'z')."
    )
    .regex(/[0-9]/, "A senha deve ter pelo menos um dígito ('0'-'9').")
    .regex(
      /[^a-zA-Z0-9]/,
      "A senha deve ter pelo menos um caractere não alfanumérico."
    )
    .refine((val) => new Set(val).size >= 1, {
      message: "A senha deve usar pelo menos 1 caractere diferente.",
    }),
});

export type RegisterFormData = z.infer<typeof registerSchema>;

export async function registerAction(data: RegisterFormData): Promise<Result> {
  const res = await fetch("/api/register", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (res.ok) {
    return {
      success: true,
      message: "Cadastro realizado com sucesso!",
      errors: null,
    };
  } else if (res.status === 400) {
    return { success: false, message: "Dados inválidos", errors: null };
  } else {
    return {
      success: false,
      message: "Erro ao realizar cadastro",
      errors: null,
    };
  }
}
