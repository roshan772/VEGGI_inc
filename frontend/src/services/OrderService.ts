import api from "./api";

// Interfaces for better typing 
interface OrderItem {
  name: string;
  quantity: number;
  image: string;
  price: number;
  product: string;
}

export interface Order {
  _id: string;
  orderItems: OrderItem[];
  orderStatus: string;
  totalPrice: number;
  createdAt?: Date;
  
}

// Create New Order
export const createOrder = async (
  data: any
): Promise<{ success: boolean; order: Order }> => {
  const res = await api.post("/order/new", data);
  return res.data;
};

// Get Single Order
export const getSingleOrder = async (
  orderId: string
): Promise<{ success: boolean; order: Order }> => {
  const res = await api.get(`/order/${orderId}`);
  return res.data;
};

// Get Logged-in User Orders
export const getMyOrders = async (): Promise<{
  success: boolean;
  orders: Order[];
}> => {
  const res = await api.get("/order/myorders");
  return res.data;
};

// ADMIN: Get All Orders
export const getAllOrders = async (): Promise<{
  success: boolean;
  orders: Order[];
}> => {
  const res = await api.get("/order");
  return res.data;
};

// ADMIN: Update Order Status
export const updateOrder = async (
  orderId: string,
  status: string
): Promise<{ success: boolean; order: Order }> => {
  const res = await api.put(`/order/${orderId}`, { status });
  return res.data;
};

// ADMIN: Delete Order
export const deleteOrder = async (
  orderId: string
): Promise<{ success: boolean }> => {
  const res = await api.delete(`/order/${orderId}`);
  return res.data;
};
