import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dotenv from "dotenv";

dotenv.config({ path: "../../.env" });

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: `http://${process.env.DB_HOST || "127.0.0.1"}:${process.env.PORT || "3000"}`,
        changeOrigin: true,
      },
    },
  },
});
