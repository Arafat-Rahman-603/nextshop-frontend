
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchProducts = createAsyncThunk("products/fetch", async () => {
  const res = await fetch(`/api/products`);
  if (!res.ok) throw new Error("Failed to fetch products");
  return await res.json();
});

const productSlice = createSlice({
  name: "products",
  initialState: { items: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (s) => { s.loading = true; })
      .addCase(fetchProducts.fulfilled, (s, a) => { s.loading = false; s.items = a.payload; })
      .addCase(fetchProducts.rejected, (s, a) => { s.loading = false; s.error = a.error.message; });
  },
});

export default productSlice.reducer;
