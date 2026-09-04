# Learning Hub V0

Static Web สำหรับ GitHub Pages เพื่อรวบรวมบทเรียน ห้องเรียน Quiz และ Simulation ที่จะสร้างขึ้นใหม่

## ขอบเขตรอบนี้

- หน้า Login ตามคอนเซปต์ที่ตกลงกัน
- สลับภาษาไทย/English ได้ครบทุกหน้าจอ และจำภาษาที่เลือกไว้ในเครื่อง
- ปุ่มทดลองเข้า Hub แบบผู้เยี่ยมชม
- โครง Dashboard, Classroom และแท็บรายวิชา
- หน้าว่างสำหรับรับเนื้อหาใหม่ทั้งหมด
- ยังไม่เชื่อม Google Sign-In, `note.js`, Shared Engine, Notebook หรือระบบ Save/Load
- ไม่มีลิงก์และไม่มีเนื้อหา Quiz เดิม
- เผยแพร่อัตโนมัติผ่าน GitHub Pages เมื่อมีการ Push เข้า `main`

## จุดที่แก้บ่อย

- `lib/hub-config.ts` — รายชื่อและลำดับแท็บ
- `lib/i18n.ts` — ข้อความภาษาไทยและภาษาอังกฤษทั้งหมด
- `components/learning-hub/login-screen.tsx` — หน้า Login
- `components/learning-hub/hub-shell.tsx` — หน้าหลักและสถานะว่างของแต่ละแท็บ
- `src/globals.css` — สี ฟอนต์ และสไตล์รวม

## คำสั่งตรวจงาน

```bash
pnpm dev
pnpm lint
pnpm typecheck
pnpm build
```

ไฟล์สำหรับ GitHub Pages อยู่ที่ `.github/workflows/learning-hub-pages.yml` บริเวณรากของ Repository
