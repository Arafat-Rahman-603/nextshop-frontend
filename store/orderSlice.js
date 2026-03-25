import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchOrders = createAsyncThunk(
  "orders/fetchOrders",
  async (userId) => {
    const res = await fetch(
      "https://nextshop-backend.onrender.com/api/orders",
      {
        headers: { "x-user-id": userId },
      },
    );
    if (!res.ok) throw new Error("Failed to fetch orders");
    return await res.json();
  },
);

export const fetchOrderById = createAsyncThunk(
  "orders/fetchOrderById",
  async ({ userId, orderId }) => {
    const res = await fetch(
      `https://nextshop-backend.onrender.com/api/orders/${orderId}`,
      {
        headers: { "x-user-id": userId },
      },
    );
    if (!res.ok) throw new Error("Failed to fetch order");
    return await res.json();
  },
);

export const placeOrder = createAsyncThunk(
  "orders/placeOrder",
  async ({ userId, orderData }) => {
    const res = await fetch(
      "https://nextshop-backend.onrender.com/api/orders",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": userId,
        },
        body: JSON.stringify(orderData),
      },
    );
    if (!res.ok) throw new Error("Failed to place order");
    return await res.json();
  },
);

const orderSlice = createSlice({
  name: "orders",
  initialState: {
    orders: [],
    currentOrder: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchOrders
      .addCase(fetchOrders.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(fetchOrders.fulfilled, (s, a) => {
        s.loading = false;
        s.orders = a.payload;
      })
      .addCase(fetchOrders.rejected, (s, a) => {
        s.loading = false;
        s.error = a.error.message;
      })
      // fetchOrderById
      .addCase(fetchOrderById.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(fetchOrderById.fulfilled, (s, a) => {
        s.loading = false;
        s.currentOrder = a.payload;
      })
      .addCase(fetchOrderById.rejected, (s, a) => {
        s.loading = false;
        s.error = a.error.message;
      })
      // placeOrder
      .addCase(placeOrder.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(placeOrder.fulfilled, (s, a) => {
        s.loading = false;
        s.orders.unshift(a.payload);
      })
      .addCase(placeOrder.rejected, (s, a) => {
        s.loading = false;
        s.error = a.error.message;
      });
  },
});

export const { clearCurrentOrder } = orderSlice.actions;
export default orderSlice.reducer;
