import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cartItems: [],
  totalAmount: 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;
      const existItem = state.cartItems.find(i => i._id === item._id);

      if (existItem) {
        existItem.quantity += 1;
      } else {
        state.cartItems.push({ ...item, quantity: 1 });
      }

      state.totalAmount = state.cartItems.reduce(
        (sum, i) => sum + i.price * i.quantity,
        0
      );
    },

    removeFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter(
        i => i._id !== action.payload
      );

      state.totalAmount = state.cartItems.reduce(
        (sum, i) => sum + i.price * i.quantity,
        0
      );
    },

    decreaseQuantity: (state, action) => {
      const item = state.cartItems.find(i => i._id === action.payload);
      if (item && item.quantity > 1) item.quantity -= 1;

      state.totalAmount = state.cartItems.reduce(
        (sum, i) => sum + i.price * i.quantity,
        0
      );
    },

    clearCart: (state) => {
      state.cartItems = [];
      state.totalAmount = 0;
    },
  },
});

export const { addToCart, removeFromCart, decreaseQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
