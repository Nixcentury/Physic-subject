# Learning Hub — เวอร์ชัน HTML พื้นฐาน

หน้าเว็บที่ใช้งานจริงเขียนด้วย HTML, CSS และ JavaScript พื้นฐาน เพื่อให้เปิดดูและช่วยแก้ไขได้ง่าย โดยไม่ต้องแก้ไฟล์ React ส่วน GitHub จะ Build และเผยแพร่ให้อัตโนมัติ

## ไฟล์ที่ต้องรู้จัก

1. `index.html` — โครงหน้า ข้อความภาษาไทย/อังกฤษ และรายชื่อแท็บ
2. `public/pages/*.html` — หน้า Overview, Classroom และแต่ละรายวิชา แก้เนื้อหาที่นี่
3. `public/pages/shared/page.css` — หน้าตาของหน้า HTML ลูกทั้งหมด
4. `public/pages/shared/page.js` — รับภาษาและ Role จาก Hub กลาง
5. `css/styles.css` — สี กระจกใส ขนาด ระยะห่าง และหน้าจอมือถือของ Hub
6. `js/app.js` — การสลับภาษา เชื่อมหน้าตากับบัญชี และเปลี่ยนแท็บ
7. `js/firebase-config.js` — การเชื่อม Firebase กลาง ปกติไม่ต้องแก้
8. `js/auth.js` — Google Login, Guest และ Logout ปกติไม่ต้องแก้
9. `js/presence.js` — Online, Idle, Offline และคนออนไลน์ ปกติไม่ต้องแก้
10. `js/roles.js` — สิทธิ์นักเรียน ครู แอดมิน และคำขอสิทธิ์ครู ปกติไม่ต้องแก้
11. `admin.html` และ `js/role-admin.js` — หน้าหลังบ้านและการจัดการสิทธิ์ครู

ในหน้า HTML ลูก ข้อความสองภาษาเขียนอยู่ด้วยกันแบบนี้:

```html
<span data-th="ฟิสิกส์" data-en="Physics">ฟิสิกส์</span>
```

แก้ข้อความไทยใน `data-th` แก้ภาษาอังกฤษใน `data-en` และแก้ข้อความระหว่าง `<span>...</span>` ให้ตรงกับภาษาไทย

## การเพิ่มหน้า HTML แยก

คัดลอกหน้าเดิมใน `public/pages` แล้วเปลี่ยนชื่อ เช่น:

```text
LEARNING HUB/
├── index.html
├── public/
│   └── pages/
│       ├── overview.html
│       ├── classroom.html
│       ├── physics.html
│       └── chemistry.html
├── css/styles.css
└── js/app.js
```

แล้วเพิ่มปุ่มใน `index.html` โดยให้ `data-page-src` ชี้ไปยังไฟล์นั้น:

```html
<button data-section="physics" data-page-src="pages/physics.html">ฟิสิกส์</button>
```

ทุกไฟล์ `.html` ที่วางไว้ใต้โฟลเดอร์ `public/pages` จะถูกนำขึ้น GitHub Pages อัตโนมัติ โดย workflow หลักไม่ต้องแก้ไข

## ขอบเขตปัจจุบัน

- หน้า Login โทนเย็นแบบกระจกฝ้า
- สลับภาษาไทย/English และจำภาษาที่เลือก
- Google Sign-In, Guest และ Logout
- แสดงรูป ชื่อ และอีเมลของบัญชีที่เข้าสู่ระบบ
- ระบบ Online, Idle, Offline และ Live Presence
- ระบบ Role นักเรียน ครู แอดมิน และหน้าส่งคำขอสิทธิ์ครู
- หน้า Admin แยกไฟล์สำหรับจัดการสิทธิ์ครู
- แท็บด้านบนเปิดหน้า Overview, Classroom และรายวิชาที่แยกเป็น HTML คนละไฟล์
- หน้า Physics มีโครง 3 ชั้นและช่องบทเริ่มต้น 4 บท
- ยังไม่มีเนื้อหา Quiz เดิม
- ยังไม่เชื่อม Notebook หรือระบบ Save/Load
- GitHub Pages เผยแพร่อัตโนมัติเมื่อ Push เข้า `main`

โฟลเดอร์ React เดิมยังเก็บไว้เป็นข้อมูลสำรอง แต่หน้าเว็บจริงไม่เรียกใช้ไฟล์เหล่านั้นแล้ว

## ลำดับงานที่ตกลงล่าสุด

สถานะปัจจุบัน: **Round 4A แยก Navigation และหน้า HTML ลูกแล้ว**

ผลตรวจฐานก่อนเริ่ม Login บันทึกไว้ที่ [`ROUND-0-BASELINE.md`](ROUND-0-BASELINE.md)

ผลการเชื่อม Login กลางบันทึกไว้ที่ [`ROUND-1-AUTH.md`](ROUND-1-AUTH.md)

ผลการเชื่อมระบบคนออนไลน์บันทึกไว้ที่ [`ROUND-2-PRESENCE.md`](ROUND-2-PRESENCE.md)

แบบบัญชีครู นักเรียน และงานหลังบ้านบันทึกไว้ที่ [`ACCOUNT-ROLES.md`](ACCOUNT-ROLES.md)

ผลการทำระบบสิทธิ์รอบ 3 บันทึกไว้ที่ [`ROUND-3-ROLES.md`](ROUND-3-ROLES.md) และกฎที่ต้องให้ผู้ดูแล Firebase ติดตั้งอยู่ใน [`FIREBASE-RULES-ROUND3.md`](FIREBASE-RULES-ROUND3.md)

ผลการแยกหน้า Navigation รอบ 4A บันทึกไว้ที่ [`ROUND-4A-NAVIGATION.md`](ROUND-4A-NAVIGATION.md)

แบบคะแนน V1 ที่เก็บเฉพาะคะแนนล่าสุดบันทึกไว้ที่ [`SCORE-DATA-V1.md`](SCORE-DATA-V1.md)

Round 1 เชื่อม Google Sign-In, Guest และ Logout แล้ว Round 2 เพิ่ม Online/Idle/Offline และ Round 3 เตรียมระบบสิทธิ์กับหน้าหลังบ้านแล้ว โดยยังไม่เริ่ม Quiz, Notebook หรือระบบ Classroom จริง

## แบบ Navigation และสิ่งที่จะทำต่อ

- ใช้แถบแท็บด้านบนเพื่อเหลือพื้นที่แสดงเนื้อหามากขึ้น
- แต่ละแท็บและแต่ละหน้าหลักแยกเป็นไฟล์ HTML สั้น ๆ เพื่อให้แก้ไขและเพิ่มหน้าได้ง่าย
- Navigation ของรายวิชามีอย่างน้อย 3 ชั้น: เลือกบท/เรื่อง → เลือกงานหรือเครื่องมือ → เปิดงานในหน้าต่างลอย
- หน้าต่างลอยต้องย่อและปิดได้ และมีแถบงานด้านล่างเพื่อเปิดหลายเนื้อหาพร้อมกัน
- ฝั่งนักเรียนมี Dashboard ห้องเรียน งานค้าง กำหนดส่ง รายละเอียดห้อง และรายการงาน
- ฝั่งครูมี Dashboard รายห้อง สร้างห้อง สั่งงานจากเนื้อหา ให้คะแนน กำหนดส่ง และหมายเหตุ
- Classroom ทำหน้าที่นำเนื้อหาจากแท็บรายวิชามาจัดระเบียบ ไม่สร้างเนื้อหาซ้ำ
- ทุกหน้ารองรับภาษาไทยและอังกฤษอย่างสมบูรณ์
- ต้องรักษา URL ของ Quiz และ Simulation เดิมทั้งหมดให้เปิดได้เสมอ

Round 4B จะต่อจากหน้า Physics ชั้นที่ 2 และระบบหน้าต่างลอย โดยยังไม่ต้องสร้าง Quiz จริง
