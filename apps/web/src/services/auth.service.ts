import api from "@/lib/api.js";

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface AuthResponse {
  message: string;
  user: User;
  token: string;
}


// ==========================================
// REGISTER
// ==========================================

export async function register(
  data: RegisterInput,
): Promise<AuthResponse> {
  const response = await api.post<AuthResponse>(
    "/auth/register",
    data,
  );

  return response.data;
}


// ==========================================
// LOGIN
// ==========================================

export async function login(
  data: LoginInput,
): Promise<AuthResponse> {
  const response = await api.post<AuthResponse>(
    "/auth/login",
    data,
  );

  return response.data;
}