# Learning Hub — Score Data V1

## ข้อตกลง

Quiz เป็นเจ้าของคะแนน ส่วน Classroom มีหน้าที่เลือก Quiz และดึงคะแนนมาแสดง โดยไม่คัดลอกคะแนนไปเก็บซ้ำใน Classroom

V1 เก็บเฉพาะคะแนนล่าสุดของนักเรียนแต่ละคนใน Quiz แต่ละชุด:

```text
quizScores/{quizId}/{studentUid}
├── score
├── maxScore
└── submittedAt
```

เมื่อทำ Quiz เดิมใหม่ ข้อมูลชุดเดิมถูกเขียนทับทันที ไม่มี `bestScore`, `attemptCount` หรือประวัติคะแนน

Classroom เก็บเพียงข้อมูลจัดระเบียบ:

```text
classrooms/{roomId}/tasks/{taskId}
├── quizId
├── dueAt
└── teacherNote
```

เมื่อครูเปิดงาน ระบบนำรายชื่อสมาชิกห้องและ `quizId` ไปอ่านคะแนนล่าสุดจาก `quizScores/{quizId}`

ถ้าภายหลังต้องแยก Quiz เดิมเป็นสอบครั้งที่ 1 และสอบแก้ตัว จึงค่อยเพิ่ม `taskId` ลงในเส้นทางคะแนน ไม่ทำล่วงหน้าใน V1
