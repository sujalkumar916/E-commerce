import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../api/axios";

// ─── Async Thunks ─────────────────────────────────────────────────────────────

export const fetchCart = createAsyncThunk("cart/fetch", async (_, { rejectWithValue }) => {
  try {
    const { data } = await API.get("/cart");
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

export const addToCart = createAsyncThunk(
  "cart/add",
  async ({ productId, quantity = 1 }, { rejectWithValue }) => {
    try {
      const { data } = await API.post("/cart/add", { productId, quantity });
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message);
    }
  }
);

export const updateCartItem = createAsyncThunk(
  "cart/update",
  async ({ productId, quantity }, { rejectWithValue }) => {
    try {
      const { data } = await API.put("/cart/update", { productId, quantity });
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message);
    }
  }
);

export const removeFromCart = createAsyncThunk(
  "cart/remove",
  async (productId, { rejectWithValue }) => {
    try {
      const { data } = await API.delete(`/cart/remove/${productId}`);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message);
    }
  }
);

export const clearCart = createAsyncThunk("cart/clear", async (_, { rejectWithValue }) => {
  try {
    await API.delete("/cart/clear");
    return null;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

// ─── Slice ────────────────────────────────────────────────────────────────────

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
    totalPrice: 0,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    const updateState = (state, action) => {
      state.loading = false;
      state.items = action.payload.cart?.items || [];
      state.totalPrice = action.payload.totalPrice || 0;
    };

    builder
      .addCase(fetchCart.pending, (state) => { state.loading = true; })
      .addCase(fetchCart.fulfilled, updateState)
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    builder
      .addCase(addToCart.fulfilled, updateState)
      .addCase(updateCartItem.fulfilled, updateState)
      .addCase(removeFromCart.fulfilled, updateState)
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateCartItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    builder.addCase(clearCart.fulfilled, (state) => {
      state.items = [];
      state.totalPrice = 0;
    });

    // Logout par cart bhi clear karo
    builder.addCase("auth/logout/fulfilled", (state) => {
      state.items = [];
      state.totalPrice = 0;
    });
  },
});

export default cartSlice.reducer;

