import api from "./api";

export const getAllProducts = async (page: number, keyword = "") => {
  const res = await api.get(`/products?page=${page}&search=${keyword}`);
  return res.data;
};

export const getProductDetails = async (id: string) => {
  const res = await api.get(`/products/${id}`);
  return res.data;
};

// ADMIN: Create Product
export const createProduct = async (data: FormData): Promise<any> => {
  const res = await api.post("/products/new", data, { 
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

// ADMIN: Update Product
export const updateProduct = async (id: string, data: FormData): Promise<any> => {
  const res = await api.put(`/products/${id}`, data, { 
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

// ADMIN: Delete Product
export const deleteProduct = async (id: string): Promise<any> => {
  const res = await api.delete(`/products/${id}`); 
  return res.data;
};