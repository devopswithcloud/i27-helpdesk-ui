import api from "@/lib/api";

export const loginStudent = async (data: {
  email: string;
  password: string;
}) => {
  const response = await api.post("/auth/login", data);
  return response.data;
};
