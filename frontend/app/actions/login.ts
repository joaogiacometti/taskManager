import z from "zod";
import { Result } from "../types/result";

export type LoginFormData = z.infer<typeof loginSchema>;

export const loginSchema = z.object({
    email: z.email("E-mail inválido"),
    password: z.string().min(8, "A senha deve ter pelo menos 8 caracteres"),
});

export async function loginAction(data: LoginFormData): Promise<Result> {
    const res = await fetch("/api/login?useCookies=true", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });

    if (res.ok) {
        return { success: true, message: "Login realizado com sucesso", errors: null };
    } else if (res.status === 401) {
        return { success: false, message: "Credenciais inválidas", errors: null };
    } else {
        return { success: false, message: "Erro ao realizar login", errors: null };
    }
}