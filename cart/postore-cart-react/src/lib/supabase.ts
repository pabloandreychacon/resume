import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://cfigfcufbornekzjxbqd.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNmaWdmY3VmYm9ybmVremp4YnFkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI5MDU4NDcsImV4cCI6MjA2ODQ4MTg0N30.Y40XGZS1wvUVku4kEKi5CpntHA3k8Y9ohzMSG9bNMHI';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Funciones helper para Supabase
export const supabaseHelpers = {
  // Obtener productos
  async getProducts() {
    const { data, error } = await supabase
      .from('products')
      .select('*');

    if (error) {
      console.error('Error fetching products:', error);
      return [];
    }

    return data || [];
  },

  // Obtener categorías
  async getCategories() {
    const { data, error } = await supabase
      .from('categories')
      .select('*');

    if (error) {
      console.error('Error fetching categories:', error);
      return [];
    }

    return data || [];
  },

  // Crear orden
  async createOrder(orderData: {
    TotalAmount: number;
    StatusId: number;
    PaymentOrderId: string;
    Currency: string;
    ShippingAddress: string;
    BillingAddress: string;
    ShippingMethod: string;
    TrackingNumber: string | null;
    EstimatedDeliveryDate: string | null;
    CreatedAt: Date;
    UpdatedAt: Date;
    BuyerEmail: string;
    BusinessEmail: string;
  }) {
    const { data, error } = await supabase
      .from('Orders')
      .insert([orderData])
      .select();

    if (error) {
      console.error('Error creating order:', error);
      throw error;
    }

    return data;
  },

  // Obtener órdenes por usuario
  async getOrdersByUser(userId: string) {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', userId);

    if (error) {
      console.error('Error fetching orders:', error);
      return [];
    }

    return data || [];
  }
}; 