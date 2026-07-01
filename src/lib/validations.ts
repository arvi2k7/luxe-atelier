import { z } from "zod/v3";

export const emailSchema = z.string().email().max(255).transform((e) => e.toLowerCase());

export const passwordSchema = z.string().min(8).max(128);

export const registerSchema = z.object({
  name: z.string().min(1).max(100),
  email: emailSchema,
  password: passwordSchema,
});

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1),
});

export const addressSchema = z.object({
  label: z.string().max(50).optional(),
  fullName: z.string().min(1).max(100),
  addressLine1: z.string().min(1).max(200),
  addressLine2: z.string().max(200).optional().default(""),
  city: z.string().min(1).max(100),
  state: z.string().max(100).optional().default(""),
  postalCode: z.string().min(1).max(20),
  country: z.string().min(1).max(100),
  phone: z.string().max(30).optional().default(""),
  isDefault: z.boolean().optional().default(false),
});

export const reviewSchema = z.object({
  productId: z.string().min(1),
  rating: z.number().int().min(1).max(5),
  title: z.string().min(1).max(200),
  body: z.string().min(1).max(5000),
});

export const orderItemSchema = z.object({
  productId: z.string().min(1),
  name: z.string().min(1).max(200),
  size: z.string().min(1).max(20),
  quantity: z.number().int().positive(),
  price: z.number().positive(),
});

export const shippingSchema = z.object({
  fullName: z.string().min(1).max(100),
  email: emailSchema,
  addressLine1: z.string().min(1).max(200),
  addressLine2: z.string().max(200).optional().default(""),
  city: z.string().min(1).max(100),
  state: z.string().max(100).optional().default(""),
  postalCode: z.string().min(1).max(20),
  country: z.string().min(1).max(100),
  phone: z.string().max(30).optional(),
});

export const createOrderSchema = z.object({
  items: z.array(orderItemSchema).min(1),
  shipping: shippingSchema,
  subtotal: z.number().positive(),
  total: z.number().positive(),
  couponCode: z.string().max(20).optional(),
});

export const profileUpdateSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  bio: z.string().max(200).optional(),
});

export const preferencesSchema = z.object({
  email: emailSchema.optional(),
  marketing: z.boolean().optional(),
  orderUpdates: z.boolean().optional(),
});

export const returnRequestSchema = z.object({
  orderNumber: z.string().min(1),
  items: z.array(z.object({
    productId: z.string().min(1),
    name: z.string().min(1),
    size: z.string().min(1),
    quantity: z.number().int().positive(),
    reason: z.string().max(500).optional().default(""),
  })).min(1),
  notes: z.string().max(1000).optional().default(""),
});

export const couponSchema = z.object({
  code: z.string().min(1).max(20).transform((c) => c.toUpperCase()),
  discountPercent: z.number().int().min(1).max(100),
  active: z.boolean().optional().default(true),
  maxUses: z.number().int().min(0).optional().default(0),
  expiresAt: z.string().optional(),
});

export const productSchema = z.object({
  name: z.string().min(1).max(200),
  description: z.string().min(1).max(10000),
  price: z.number().positive(),
  category: z.string().min(1).max(100),
  images: z.array(z.string().url()).min(1),
  sizes: z.array(z.string().min(1)).min(1),
  stock: z.number().int().min(0),
  featured: z.boolean().optional().default(false),
});

export const giftCardPurchaseSchema = z.object({
  amount: z.number().min(5),
  recipientEmail: emailSchema,
  senderName: z.string().max(100).optional(),
  message: z.string().max(500).optional(),
});

export const couponValidateSchema = z.object({
  code: z.string().min(1).max(20),
  subtotal: z.number().positive().optional(),
});

export const stockAlertSchema = z.object({
  productId: z.string().min(1),
  email: emailSchema,
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: passwordSchema,
});

export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1),
  password: passwordSchema,
});
