import { resolve } from "node:path";
import { defineConfig } from "vite";

/*
  แต่ละหน้าหลักเป็น HTML แยกไฟล์และ Build ไปด้วยกัน
  เพิ่มหน้าใหม่ภายหลังได้โดยใส่ชื่อและไฟล์ใน input นี้
*/
export default defineConfig({
  build: {
    rolldownOptions: {
      input: {
        hub: resolve(import.meta.dirname, "index.html"),
        admin: resolve(import.meta.dirname, "admin.html"),
      },
    },
  },
});
