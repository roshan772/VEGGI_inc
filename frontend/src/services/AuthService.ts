import api from "./api";

export const register = async (data: FormData): Promise<Response> => {
  const res = await api.post("/auth/register", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};
export const login = async (data:{email:string;password:string}) => {
    const res = await api.post("/auth/login", data);
    return res.data;
}
export const logout = async () => {
    const res = await api.post("/auth/logout");
    return res.data;
}
export const getCurrentUser = async () => {
    const res = await api.get("/auth/me");
    return res.data;
}
export const forgotPassword = async (email: string): Promise<Response> => {
  const res = await api.post("/auth/forgot-password", { email });
  return res.data;
};

export const resetPassword = async (
  token: string,
  password: string,
  confirmPassword: string
): Promise<Response> => {
  const res = await api.put(`/auth/reset-password/${token}`, {
    password,
    confirmPassword,
  });
  return res.data;
};