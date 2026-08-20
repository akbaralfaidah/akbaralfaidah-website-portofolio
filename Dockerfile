# ========================================
# Stage 1: Build — Vite membutuhkan semua VITE_* env vars saat build time
# ========================================
FROM node:22-alpine AS build

WORKDIR /app

# Deklarasi build arguments untuk setiap env variable
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_ANON_KEY
ARG VITE_EMAILJS_SERVICE_ID
ARG VITE_EMAILJS_TEMPLATE_ID
ARG VITE_EMAILJS_PUBLIC_KEY
ARG VITE_TURNSTILE_SITE_KEY
ARG VITE_WHATSAPP_NUMBER
ARG VITE_CONTACT_EMAIL

# "Turunkan" ARG jadi ENV agar Vite bisa membacanya saat npm run build
# (ARG saja TIDAK cukup — proses di dalam RUN tidak bisa lihat ARG)
ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL \
    VITE_SUPABASE_ANON_KEY=$VITE_SUPABASE_ANON_KEY \
    VITE_EMAILJS_SERVICE_ID=$VITE_EMAILJS_SERVICE_ID \
    VITE_EMAILJS_TEMPLATE_ID=$VITE_EMAILJS_TEMPLATE_ID \
    VITE_EMAILJS_PUBLIC_KEY=$VITE_EMAILJS_PUBLIC_KEY \
    VITE_TURNSTILE_SITE_KEY=$VITE_TURNSTILE_SITE_KEY \
    VITE_WHATSAPP_NUMBER=$VITE_WHATSAPP_NUMBER \
    VITE_CONTACT_EMAIL=$VITE_CONTACT_EMAIL

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# ========================================
# Stage 2: Serve — Nginx melayani file statis hasil build
# ========================================
FROM nginx:alpine AS production

# Hapus konfigurasi default nginx
RUN rm /etc/nginx/conf.d/default.conf

# Copy konfigurasi nginx custom (SPA routing)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy hasil build Vite ke folder serve nginx
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
