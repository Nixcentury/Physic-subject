/* ==============================================================
   ระบบหน้าต่างงานกลางของ Learning Hub
   - รายวิชาส่งเพียง toolId ที่อนุญาตไว้ด้านล่าง
   - หน้าต่างยังอยู่เมื่อเปลี่ยนแท็บวิชา
   - รองรับเปิดหลายงาน ย่อ เรียกกลับ ขยาย และปิด
================================================================ */

import {
  createContentContext,
  createHubContextMessage,
} from "./content-context.js";

const toolTypes = {
  activity: {
    icon: "✎",
    page: "pages/tools/activity-preview.html",
    titleTh: "พื้นที่งานตัวอย่าง",
    titleEn: "Activity workspace",
    accent: "blue",
  },
  simulation: {
    icon: "◉",
    page: "pages/tools/simulation-preview.html",
    titleTh: "ห้องทดลองตัวอย่าง",
    titleEn: "Simulation workspace",
    accent: "mint",
  },
  notebook: {
    icon: "▱",
    page: "pages/tools/notebook-preview.html",
    titleTh: "สมุดเขียนกลาง",
    titleEn: "Notebook Core",
    accent: "violet",
  },
};

const subjects = {
  physics: { titleTh: "ฟิสิกส์", titleEn: "Physics" },
  chemistry: { titleTh: "เคมี", titleEn: "Chemistry" },
  biology: { titleTh: "ชีววิทยา", titleEn: "Biology" },
  "lower-science": {
    titleTh: "วิทยาศาสตร์ ม.ต้น",
    titleEn: "Lower Secondary Science",
  },
  "science-ep": { titleTh: "วิทยาศาสตร์ EP", titleEn: "Science EP" },
  "math-ep": { titleTh: "คณิตศาสตร์ EP", titleEn: "Mathematics EP" },
  "upper-math": {
    titleTh: "คณิตศาสตร์ ม.ปลาย",
    titleEn: "Upper Secondary Mathematics",
  },
};

function buildToolCatalog() {
  const catalog = {};

  Object.entries(subjects).forEach(([subjectId, subject]) => {
    for (let chapter = 1; chapter <= 4; chapter += 1) {
      Object.entries(toolTypes).forEach(([typeId, type]) => {
        const id = `${subjectId}-c${chapter}-${typeId}`;
        catalog[id] = {
          ...type,
          id,
          context: createContentContext({
            subjectId,
            chapterId: chapter,
            toolKind: typeId,
            contentId: id,
          }),
          titleTh: `${type.titleTh} · ${subject.titleTh} · บทที่ ${chapter}`,
          titleEn: `${type.titleEn} · ${subject.titleEn} · Chapter ${chapter}`,
        };
      });
    }
  });

  return catalog;
}

const toolCatalog = buildToolCatalog();

function clamp(value, minimum, maximum) {
  return Math.min(Math.max(value, minimum), Math.max(minimum, maximum));
}

export function createWorkspace({
  windowLayer,
  taskbar,
  taskbarItems,
  countElement,
  getLanguage,
  getIdentity,
  getRole,
}) {
  const records = new Map();
  let highestZIndex = 30;
  let cascadeIndex = 0;

  function language() {
    return getLanguage() === "en" ? "en" : "th";
  }

  function label(thai, english) {
    return language() === "th" ? thai : english;
  }

  function setTaskbarVisibility() {
    countElement.textContent = String(records.size);
    taskbar.hidden = records.size === 0;
  }

  function updateRecordText(record) {
    const title = language() === "th" ? record.tool.titleTh : record.tool.titleEn;
    const isMaximized = record.element.classList.contains("is-maximized");

    record.title.textContent = title;
    record.frame.title = title;
    record.taskTitle.textContent = title;
    record.closeButton.setAttribute("aria-label", label("ปิดงาน", "Close tool"));
    record.closeButton.title = label("ปิด", "Close");
    record.minimizeButton.setAttribute("aria-label", label("ย่อเก็บในแถบล่าง", "Minimize to taskbar"));
    record.minimizeButton.title = label("ย่อ", "Minimize");
    record.maximizeButton.setAttribute(
      "aria-label",
      isMaximized ? label("คืนขนาดหน้าต่าง", "Restore window size") : label("ขยายหน้าต่าง", "Maximize window"),
    );
    record.maximizeButton.title = isMaximized
      ? label("คืนขนาด", "Restore")
      : label("ขยาย", "Maximize");
    record.taskButton.setAttribute(
      "aria-label",
      record.minimized
        ? label(`เรียก ${title} กลับ`, `Restore ${title}`)
        : label(`ย่อหรือเรียก ${title}`, `Minimize or focus ${title}`),
    );
  }

  function postContext(record) {
    const targetOrigin = location.origin === "null" ? "*" : location.origin;
    record.frame.contentWindow?.postMessage(
      createHubContextMessage({
        language: language(),
        role: getRole(),
        identity: getIdentity(),
        content: record.tool.context,
      }),
      targetOrigin,
    );
  }

  function focus(record) {
    if (!record || record.minimized) return;
    highestZIndex += 1;
    record.element.style.zIndex = String(highestZIndex);
    records.forEach((candidate) => {
      const isActive = candidate === record;
      candidate.element.classList.toggle("is-active", isActive);
      candidate.taskButton.classList.toggle("is-active", isActive);
      candidate.taskButton.setAttribute("aria-pressed", String(isActive));
    });
  }

  function positionNewWindow(record) {
    const layerBounds = windowLayer.getBoundingClientRect();
    const windowBounds = record.element.getBoundingClientRect();
    const offset = (cascadeIndex % 5) * 24;
    cascadeIndex += 1;

    record.element.style.left = `${clamp(
      (layerBounds.width - windowBounds.width) / 2 + offset - 48,
      8,
      layerBounds.width - windowBounds.width - 8,
    )}px`;
    record.element.style.top = `${clamp(
      20 + offset,
      8,
      layerBounds.height - windowBounds.height - 8,
    )}px`;
  }

  function restore(record) {
    if (!record) return;
    record.minimized = false;
    record.element.hidden = false;
    record.taskButton.classList.remove("is-minimized");
    updateRecordText(record);
    focus(record);
    requestAnimationFrame(() => record.element.focus());
  }

  function minimize(record) {
    if (!record) return;
    record.minimized = true;
    record.element.hidden = true;
    record.element.classList.remove("is-active");
    record.taskButton.classList.remove("is-active");
    record.taskButton.classList.add("is-minimized");
    record.taskButton.setAttribute("aria-pressed", "false");
    updateRecordText(record);

    const nextRecord = [...records.values()]
      .filter((candidate) => !candidate.minimized)
      .sort((first, second) => Number(second.element.style.zIndex) - Number(first.element.style.zIndex))[0];
    if (nextRecord) focus(nextRecord);
    record.taskButton.focus();
  }

  function toggleMaximize(record) {
    if (!record) return;
    record.element.classList.toggle("is-maximized");
    updateRecordText(record);
    focus(record);
  }

  function close(record) {
    if (!record) return;
    const taskButton = record.taskButton;
    record.element.remove();
    record.taskButton.remove();
    records.delete(record.tool.id);
    setTaskbarVisibility();

    const nextRecord = [...records.values()]
      .filter((candidate) => !candidate.minimized)
      .sort((first, second) => Number(second.element.style.zIndex) - Number(first.element.style.zIndex))[0];
    if (nextRecord) {
      focus(nextRecord);
      nextRecord.element.focus();
    } else if (records.size) {
      [...records.values()][0].taskButton.focus();
    } else {
      taskButton.blur();
    }
  }

  function enableDragging(record) {
    let drag = null;

    record.bar.addEventListener("pointerdown", (event) => {
      if (event.button !== 0 || event.target.closest("button")) return;
      if (record.element.classList.contains("is-maximized")) return;

      const layerBounds = windowLayer.getBoundingClientRect();
      const windowBounds = record.element.getBoundingClientRect();
      drag = {
        pointerId: event.pointerId,
        startX: event.clientX,
        startY: event.clientY,
        startLeft: windowBounds.left - layerBounds.left,
        startTop: windowBounds.top - layerBounds.top,
      };
      record.bar.setPointerCapture(event.pointerId);
      record.element.classList.add("is-dragging");
      focus(record);
      event.preventDefault();
    });

    record.bar.addEventListener("pointermove", (event) => {
      if (!drag || drag.pointerId !== event.pointerId) return;
      const layerBounds = windowLayer.getBoundingClientRect();
      const windowBounds = record.element.getBoundingClientRect();
      record.element.style.left = `${clamp(
        drag.startLeft + event.clientX - drag.startX,
        8,
        layerBounds.width - windowBounds.width - 8,
      )}px`;
      record.element.style.top = `${clamp(
        drag.startTop + event.clientY - drag.startY,
        8,
        layerBounds.height - windowBounds.height - 8,
      )}px`;
    });

    const stopDragging = (event) => {
      if (!drag || drag.pointerId !== event.pointerId) return;
      record.element.classList.remove("is-dragging");
      if (record.bar.hasPointerCapture(event.pointerId)) {
        record.bar.releasePointerCapture(event.pointerId);
      }
      drag = null;
    };

    record.bar.addEventListener("pointerup", stopDragging);
    record.bar.addEventListener("pointercancel", stopDragging);
  }

  function createRecord(tool) {
    const element = document.createElement("article");
    element.className = `workspace-window accent-${tool.accent}`;
    element.dataset.toolId = tool.id;
    element.tabIndex = -1;
    element.innerHTML = `
      <header class="workspace-window-bar">
        <div class="window-controls">
          <button class="window-control is-close" type="button"><span aria-hidden="true">×</span></button>
          <button class="window-control is-minimize" type="button"><span aria-hidden="true">−</span></button>
          <button class="window-control is-maximize" type="button"><span aria-hidden="true">+</span></button>
        </div>
        <div class="window-identity">
          <span class="window-icon" aria-hidden="true">${tool.icon}</span>
          <strong class="window-title"></strong>
        </div>
        <span class="window-drag-hint" aria-hidden="true">•••</span>
      </header>
      <iframe class="workspace-tool-frame" src="${tool.page}" loading="eager"></iframe>
    `;

    const taskButton = document.createElement("button");
    taskButton.className = `taskbar-item accent-${tool.accent}`;
    taskButton.type = "button";
    taskButton.innerHTML = `
      <span class="taskbar-item-icon" aria-hidden="true">${tool.icon}</span>
      <span class="taskbar-item-title"></span>
      <span class="taskbar-state" aria-hidden="true">●</span>
    `;

    const record = {
      tool,
      element,
      bar: element.querySelector(".workspace-window-bar"),
      title: element.querySelector(".window-title"),
      frame: element.querySelector(".workspace-tool-frame"),
      closeButton: element.querySelector(".is-close"),
      minimizeButton: element.querySelector(".is-minimize"),
      maximizeButton: element.querySelector(".is-maximize"),
      taskButton,
      taskTitle: taskButton.querySelector(".taskbar-item-title"),
      minimized: false,
    };

    record.closeButton.addEventListener("click", () => close(record));
    record.minimizeButton.addEventListener("click", () => minimize(record));
    record.maximizeButton.addEventListener("click", () => toggleMaximize(record));
    record.element.addEventListener("pointerdown", () => focus(record));
    record.frame.addEventListener("load", () => postContext(record));
    record.taskButton.addEventListener("click", () => {
      const isFrontmost = record.element.classList.contains("is-active");
      if (record.minimized) restore(record);
      else if (isFrontmost) minimize(record);
      else focus(record);
    });

    enableDragging(record);
    updateRecordText(record);
    return record;
  }

  function open(toolId) {
    const tool = toolCatalog[toolId];
    if (!tool) return false;

    const existingRecord = records.get(toolId);
    if (existingRecord) {
      restore(existingRecord);
      return true;
    }

    const record = createRecord(tool);
    records.set(toolId, record);
    windowLayer.append(record.element);
    taskbarItems.append(record.taskButton);
    positionNewWindow(record);
    setTaskbarVisibility();
    focus(record);
    requestAnimationFrame(() => record.element.focus());
    return true;
  }

  function setLanguage() {
    records.forEach((record) => {
      updateRecordText(record);
      postContext(record);
    });
  }

  function setContext() {
    records.forEach((record) => postContext(record));
  }

  function clear() {
    records.forEach((record) => {
      record.element.remove();
      record.taskButton.remove();
    });
    records.clear();
    setTaskbarVisibility();
  }

  window.addEventListener("resize", () => {
    records.forEach((record) => {
      if (record.minimized || record.element.classList.contains("is-maximized")) return;
      const layerBounds = windowLayer.getBoundingClientRect();
      const windowBounds = record.element.getBoundingClientRect();
      record.element.style.left = `${clamp(
        windowBounds.left - layerBounds.left,
        8,
        layerBounds.width - windowBounds.width - 8,
      )}px`;
      record.element.style.top = `${clamp(
        windowBounds.top - layerBounds.top,
        8,
        layerBounds.height - windowBounds.height - 8,
      )}px`;
    });
  });

  return { open, setLanguage, setContext, clear };
}
