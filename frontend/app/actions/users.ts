import { User } from "../types/user";

export async function getUsers(): Promise<User[]> {
  const res = await fetch("/api/usuarios", {
    method: "GET",
    credentials: "include",
    cache: "no-store",
  });

  if (res.status === 204) {
    return [];
  }

  if (res.ok) {
    const users = await res.json();
    return users;
  }

  return [];
}
