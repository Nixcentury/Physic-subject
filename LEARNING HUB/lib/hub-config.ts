export type HubIconName =
  | 'dashboard'
  | 'classroom'
  | 'physics'
  | 'chemistry'
  | 'biology'
  | 'science'
  | 'math';

export type HubSection = {
  id: string;
  label: string;
  eyebrow: string;
  kind: 'system' | 'subject';
  icon: HubIconName;
};

// แก้รายชื่อและลำดับแท็บของ Hub ได้จากไฟล์นี้ไฟล์เดียว
export const hubSections: HubSection[] = [
  {
    id: 'dashboard',
    label: 'ภาพรวม',
    eyebrow: 'Dashboard',
    kind: 'system',
    icon: 'dashboard',
  },
  {
    id: 'classroom',
    label: 'ห้องเรียน',
    eyebrow: 'Classroom',
    kind: 'system',
    icon: 'classroom',
  },
  {
    id: 'physics',
    label: 'ฟิสิกส์',
    eyebrow: 'Physics',
    kind: 'subject',
    icon: 'physics',
  },
  {
    id: 'chemistry',
    label: 'เคมี',
    eyebrow: 'Chemistry',
    kind: 'subject',
    icon: 'chemistry',
  },
  {
    id: 'biology',
    label: 'ชีววิทยา',
    eyebrow: 'Biology',
    kind: 'subject',
    icon: 'biology',
  },
  {
    id: 'lower-secondary-science',
    label: 'วิทยาศาสตร์ ม.ต้น',
    eyebrow: 'Lower Secondary',
    kind: 'subject',
    icon: 'science',
  },
  {
    id: 'science-ep',
    label: 'วิทยาศาสตร์ EP',
    eyebrow: 'Science EP',
    kind: 'subject',
    icon: 'science',
  },
  {
    id: 'math-ep',
    label: 'คณิตศาสตร์ EP',
    eyebrow: 'Math EP',
    kind: 'subject',
    icon: 'math',
  },
  {
    id: 'upper-secondary-math',
    label: 'คณิตศาสตร์ ม.ปลาย',
    eyebrow: 'Upper Secondary',
    kind: 'subject',
    icon: 'math',
  },
];
