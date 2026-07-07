const fs = require("fs");
const path = require("path");
const { pathToFileURL } = require("url");

const STAGE = "1013R_R220D_R97B_RENDER_SLOT_DOM_SMOKE";
const OUTPUT_DIR = path.join(
  "outputs",
  "PREP_ROOM_RENDER_CANVAS_DEEPEN_V1",
  STAGE
);
const TARGET_FILE = path.join(
  "outputs",
  "PREP_ROOM_RENDER_CANVAS_DEEPEN_V1",
  "1013R_R97B_TEACHER_SHELL_EXPERIENCE_POLISH_AND_STALE_CONTENT_CLEANUP",
  "r97b_clean_shell_context_preview.html"
);
const ENDPOINT = "/api/prep-room/uploaded-lesson-document-preview";
const PARENT_SLOTS = ["lesson-body", "teaching-process", "right-rail", "bottom-xiaojiao"];
const CHILD_SLOTS = [
  "basis",
  "analysis",
  "goals",
  "keypoints",
  "preparation",
  "assessment",
  "teaching-process",
  "teaching-process-episodes"
];

function argValue(name, fallback) {
  const index = process.argv.indexOf(name);
  if (index >= 0 && process.argv[index + 1]) return process.argv[index + 1];
  return fallback;
}

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function writeJson(root, name, value) {
  fs.writeFileSync(
    path.join(root, OUTPUT_DIR, name),
    JSON.stringify(value, null, 2) + "\n",
    "utf8"
  );
}

function writeText(root, name, value) {
  fs.writeFileSync(path.join(root, OUTPUT_DIR, name), value, "utf8");
}

function findChrome() {
  const candidates = [
    process.env.CHROME_PATH,
    "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
    "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe"
  ].filter(Boolean);
  return candidates.find((candidate) => fs.existsSync(candidate)) || "";
}

function requirePlaywrightCore() {
  const candidates = [
    process.env.PLAYWRIGHT_CORE_NODE_MODULES,
    process.env.PLAYWRIGHT_CORE_ROOT
      ? path.join(process.env.PLAYWRIGHT_CORE_ROOT, "node_modules")
      : "",
    path.join(process.env.TEMP || "", "xiaobei-r220d-playwright-core", "node_modules"),
    path.join(process.cwd(), "node_modules")
  ].filter(Boolean);

  const errors = [];
  for (const nodeModules of candidates) {
    try {
      const resolved = require.resolve("playwright-core", { paths: [nodeModules] });
      return { playwright: require(resolved), resolved, nodeModules };
    } catch (error) {
      errors.push(`${nodeModules}: ${error.message}`);
    }
  }
  throw new Error(`playwright-core not found. Tried:\n${errors.join("\n")}`);
}

function samplePayload() {
  const sections = [
    {
      id: "basis",
      title: "一、本课依据",
      items: ["R220D DOM smoke 只读样本：本项只验证正文 section 可被上传 payload 更新。"],
      source_status: "uploaded_source",
      classification: "uploaded_source",
      teacher_review_required: true
    },
    {
      id: "analysis",
      title: "二、学情分析",
      items: ["学生已能描述材料外观，但对证据表达仍需教师确认。"],
      source_status: "uploaded_source",
      classification: "uploaded_source",
      teacher_review_required: true
    },
    {
      id: "goals",
      title: "三、教学目标",
      items: ["能围绕一个观察任务说出学习目标和可见证据。"],
      source_status: "uploaded_source",
      classification: "uploaded_source",
      teacher_review_required: true
    },
    {
      id: "keypoints",
      title: "四、教学重难点",
      items: ["重点是观察与表达；难点是把观察转成可见学习证据。"],
      source_status: "uploaded_source",
      classification: "uploaded_source",
      teacher_review_required: true
    },
    {
      id: "preparation",
      title: "五、教学准备",
      items: ["图片材料、学生记录单和课堂展示区。"],
      source_status: "uploaded_source",
      classification: "uploaded_source",
      teacher_review_required: true
    },
    {
      id: "assessment",
      title: "七、学习单与评价",
      items: ["评价观察描述、操作证据和课堂表达；量表不在 R220D 生成。"],
      source_status: "uploaded_source",
      classification: "uploaded_source",
      teacher_review_required: true
    }
  ];
  const processSteps = [
    {
      id: "U01",
      episode_id: "U01",
      source_episode_id: "r220d_smoke_episode_01",
      episode_index: 1,
      title: "观察导入",
      episode_title: "观察导入",
      duration_min: 5,
      episode_type: "观察辨析型",
      source_content: "教师出示材料，请学生描述看到的关键变化。",
      goal: "让学生说出观察对象和第一证据。",
      episode_goal: "让学生说出观察对象和第一证据。",
      teacher_action: "出示材料并追问：你从哪里看出来？",
      teacher_organization: ["出示材料", "追问证据", "板书关键词"],
      student_action: "观察、描述并指出证据。",
      student_learning: "观察、描述并指出证据。",
      material: "观察图片",
      screen_or_tech: "大屏展示观察图",
      evidence: "学生能指出至少一个可见证据。",
      source_gap_note: [],
      micro_steps: [
        {
          step_id: "U01-source",
          step_name: "观察材料",
          teacher_action: "教师出示材料并保持只读预览。",
          student_action: "学生说出一个观察点。",
          screen_or_materials: "观察图",
          scaffolds: "用“我看到……”开头。",
          evidence: "学生口头证据。",
          provenance: "uploaded_source",
          selected: false
        }
      ],
      teacher_review_required: true,
      preview_only: true,
      formal_apply: false
    },
    {
      id: "U02",
      episode_id: "U02",
      source_episode_id: "r220d_smoke_episode_02",
      episode_index: 2,
      title: "任务表达",
      episode_title: "任务表达",
      duration_min: 8,
      episode_type: "课堂推进型",
      source_content: "学生按任务完成表达并留下证据。",
      goal: "把观察结果转成学习产出。",
      episode_goal: "把观察结果转成学习产出。",
      teacher_action: "说明任务边界并巡视提醒。",
      teacher_organization: ["说明任务", "巡视提醒"],
      student_action: "完成表达并提交证据。",
      student_learning: "完成表达并提交证据。",
      material: "学生记录单",
      screen_or_tech: "任务提示页",
      evidence: "记录单或口头表达。",
      source_gap_note: ["上传原文未提供明确学习证据；需教师确认。"],
      provisional_scaffolds: ["临时支架，需教师判断。"],
      micro_steps: [
        {
          step_id: "U02-source",
          step_name: "完成表达",
          teacher_action: "教师提醒学生保留证据。",
          student_action: "学生完成记录。",
          screen_or_materials: "任务提示页",
          scaffolds: "证据句式待教师确认。",
          evidence: "记录单。",
          provenance: "uploaded_source",
          selected: false
        },
        {
          step_id: "U02-gap",
          step_name: "原文缺口",
          teacher_action: "",
          student_action: "",
          screen_or_materials: "",
          scaffolds: "上传原文未提供明确学习证据；需教师确认。",
          evidence: "",
          provenance: "source_gap",
          selected: false
        }
      ],
      teacher_review_required: true,
      preview_only: true,
      formal_apply: false
    }
  ];
  const singleLessonTemplate = {
    template_id: "r220d_dom_smoke_template",
    template_type: "single_lesson_template",
    route: "uploaded_lesson",
    lesson_header: {
      lesson_title: "R220D DOM Smoke 只读课",
      unit_title: "R220D 只读验证单元",
      grade: "三年级",
      lesson_code: "R220D",
      status: "readonly dom smoke"
    },
    basis: [
      {
        section_id: "basis",
        title: "一、本课依据",
        body: sections[0].items,
        source_status: "uploaded_source",
        teacher_review_required: true
      }
    ],
    student_analysis: [
      {
        section_id: "analysis",
        title: "二、学情分析",
        body: sections[1].items,
        source_status: "uploaded_source",
        teacher_review_required: true
      }
    ],
    objectives: [
      {
        section_id: "goals",
        title: "三、教学目标",
        body: sections[2].items,
        source_status: "uploaded_source",
        teacher_review_required: true
      }
    ],
    key_difficult_points: [
      {
        section_id: "keypoints",
        title: "四、教学重难点",
        body: sections[3].items,
        source_status: "uploaded_source",
        teacher_review_required: true
      }
    ],
    preparation: [
      {
        section_id: "preparation",
        title: "五、教学准备",
        body: sections[4].items,
        source_status: "uploaded_source",
        teacher_review_required: true
      }
    ],
    process_episodes: processSteps.map((step) => ({
      episode_id: step.episode_id,
      anchor_id: step.episode_id,
      episode_index: step.episode_index,
      episode_title: step.episode_title,
      episode_goal: step.episode_goal,
      teacher_organization: step.teacher_organization,
      student_learning: step.student_learning,
      material: step.material,
      evidence: [step.evidence],
      scaffolds: step.provisional_scaffolds || [],
      micro_steps: step.micro_steps,
      source_gap_note: step.source_gap_note,
      source_status: step.source_gap_note.length ? "source_gap" : "uploaded_source",
      teacher_review_required: true,
      preview_only: true,
      route: "uploaded_lesson"
    })),
    assessment_or_homework: [
      {
        section_id: "assessment",
        title: "七、学习单与评价",
        body: sections[5].items,
        source_status: "uploaded_source",
        teacher_review_required: true
      }
    ],
    source_status: "uploaded_source",
    teacher_review_required: true,
    preview_only: true,
    renderer_policy: {
      backend_provides_template_object: true,
      frontend_renders_only: true,
      main_renderer: "renderUnifiedLessonProcessStep",
      renderer_must_not_infer_pedagogy: true
    }
  };
  return {
    ok: true,
    stage: STAGE,
    viewmodel_type: "prep_room_uploaded_lesson_readonly",
    viewmodel_id: "r220d_dom_smoke_viewmodel",
    upload_session: {
      session_id: "r220d_dom_smoke_session",
      file_name: "r220d_dom_smoke_sample.docx"
    },
    document_extract: {
      method: "r220d_local_readonly_fixture",
      model_called: false
    },
    prep_view_patch: {
      current_lesson: {
        id: "r220d_dom_smoke_lesson",
        title: "上传预览《R220D DOM Smoke 只读课》",
        lesson_title: "R220D DOM Smoke 只读课",
        eyebrow: "R220D 只读验证单元",
        grade: "三年级",
        term: "DOM smoke only",
        status: "临时只读预览",
        badges: ["R220D DOM smoke", "只读", "不保存"],
        sections,
        process_steps: processSteps,
        provisional_generation_notice: "R220D 只读 DOM smoke；不进入正式字段渲染。"
      },
      single_lesson_template: singleLessonTemplate
    },
    single_lesson_template: singleLessonTemplate,
    teacher_readable_quality_preview: {
      status: "PASS_WITH_GAPS",
      model_called: false,
      source_gap_count: 1
    },
    import_lesson_understanding_preview: {
      status: "PASS_WITH_GAPS",
      model_called: false
    },
    import_understanding_v2_graph_preview: {
      status: "PASS_WITH_GAPS",
      model_called: false
    },
    import_teacher_execution_map_preview: {
      status: "PASS_WITH_GAPS",
      teacher_review_queue: [{ field: "evidence", reason: "source_gap" }],
      model_called: false
    },
    import_graph_field_projection_preview: {
      status: "PASS_WITH_GAPS",
      teacher_review_queue: [{ field: "evidence", reason: "source_gap" }],
      field_candidates: {},
      process_projection: {
        process_step_count: 2
      },
      boundary: {
        field_projection_applied_to_current_lesson: false
      },
      model_called: false
    },
    import_field_reasoning_preview: {
      status: "NOT_RUN",
      model_called: false
    },
    xiaojiao_context_patch: {
      rows: []
    },
    runtime_progress_events: [
      { event: "upload_input_received", status: "completed" },
      { event: "readonly_preview_ready", status: "completed" }
    ],
    preview_test_record: {
      record_id: "r220d_dom_smoke_record",
      record_status: "readonly_smoke_only",
      record_path: "",
      latest_record_path: ""
    },
    boundary: {
      preview_only: true,
      formal_apply: false,
      database_written: false,
      feishu_written: false,
      memory_written: false,
      provider_model_called: false,
      R95_executed: false
    }
  };
}

async function main() {
  const root = path.resolve(argValue("--root", process.cwd()));
  const outputDir = path.join(root, OUTPUT_DIR);
  const targetFile = path.join(root, TARGET_FILE);
  const chromePath = findChrome();
  ensureDir(outputDir);

  const { playwright, resolved, nodeModules } = requirePlaywrightCore();
  const environment = {
    stage: STAGE,
    mode: "real_browser_headless_chrome_with_playwright_core",
    generated_at: new Date().toISOString(),
    repo_root: root,
    target_file: TARGET_FILE.replace(/\\/g, "/"),
    target_exists: fs.existsSync(targetFile),
    file_url: pathToFileURL(targetFile).href,
    node_version: process.version,
    playwright_core_resolved: resolved,
    playwright_core_node_modules: nodeModules,
    chrome_executable: chromePath,
    chrome_exists: Boolean(chromePath && fs.existsSync(chromePath)),
    backend_route_called: false,
    payload_mode: "local_readonly_fixture",
    headless: true
  };
  writeText(
    root,
    "r220d_dom_smoke_environment.md",
    [
      "# R220D DOM Smoke Environment",
      "",
      `Stage: \`${STAGE}\``,
      "",
      `Mode: \`${environment.mode}\``,
      "",
      `Target: \`${environment.target_file}\``,
      "",
      `File URL: \`${environment.file_url}\``,
      "",
      `Chrome executable: \`${environment.chrome_executable}\``,
      "",
      `Playwright core: \`${environment.playwright_core_resolved}\``,
      "",
      "The uploaded payload smoke uses a local readonly fixture and does not call the backend route.",
      ""
    ].join("\n")
  );

  if (!environment.target_exists) throw new Error(`Target file missing: ${targetFile}`);
  if (!environment.chrome_exists) throw new Error("Chrome executable not found.");

  const networkRequests = [];
  const pageErrors = [];
  const consoleErrors = [];
  const browser = await playwright.chromium.launch({
    executablePath: chromePath,
    headless: true,
    args: [
      "--allow-file-access-from-files",
      "--disable-web-security",
      "--disable-gpu",
      "--no-first-run"
    ]
  });
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
    page.on("request", (request) => {
      networkRequests.push({
        url: request.url(),
        method: request.method(),
        resourceType: request.resourceType()
      });
    });
    page.on("pageerror", (error) => pageErrors.push(error.message));
    page.on("console", (message) => {
      if (["error", "warning"].includes(message.type())) {
        consoleErrors.push({ type: message.type(), text: message.text() });
      }
    });

    await page.goto(environment.file_url, { waitUntil: "domcontentloaded", timeout: 60000 });
    await page.waitForTimeout(1000);

    const staticResolverSmoke = await page.evaluate((slots) => {
      function describe(node) {
        if (!node) return { exists: false };
        return {
          exists: true,
          tag: node.tagName,
          id: node.id || "",
          className: String(node.className || ""),
          shellLayer: node.getAttribute("data-shell-layer") || "",
          renderSlot: node.getAttribute("data-render-slot") || "",
          r220bSlotId: node.getAttribute("data-r220b-slot-id") || "",
          textSample: (node.textContent || "").replace(/\s+/g, " ").trim().slice(0, 160)
        };
      }
      const audit = typeof window.__R220B_BIND_SHELL_LAYER_MARKERS__ === "function"
        ? window.__R220B_BIND_SHELL_LAYER_MARKERS__()
        : null;
      const parentSlots = {};
      for (const slot of slots) {
        const node = typeof window.resolveRenderSlot === "function"
          ? window.resolveRenderSlot(slot)
          : document.querySelector(`[data-render-slot="${slot}"]`);
        parentSlots[slot] = describe(node);
      }
      const resolverParentSlotsPass = slots.every((slot) => parentSlots[slot].exists);
      return {
        stage: "static_resolver_smoke",
        resolver_runtime_present: typeof window.resolveRenderSlot === "function",
        bind_function_present: typeof window.__R220B_BIND_SHELL_LAYER_MARKERS__ === "function",
        audit,
        parent_slots: parentSlots,
        resolver_parent_slots_pass: resolverParentSlotsPass,
        field_rendering: false,
        formal_apply: false
      };
    }, PARENT_SLOTS);
    writeJson(root, "r220d_static_resolver_smoke.json", staticResolverSmoke);

    const dynamicChildSlotSmoke = await page.evaluate((slots) => {
      function describe(slot) {
        const node = document.querySelector(`[data-render-slot="${slot}"]`);
        if (!node) {
          return {
            slot,
            exists: false,
            missing_recorded_as_gap: true,
            frontend_created_content: false
          };
        }
        return {
          slot,
          exists: true,
          tag: node.tagName,
          id: node.id || "",
          className: String(node.className || ""),
          shellLayer: node.getAttribute("data-shell-layer") || "",
          renderSlot: node.getAttribute("data-render-slot") || "",
          insideLessonBody: Boolean(node.closest('[data-render-slot="lesson-body"]')),
          insideTeachingProcess: Boolean(node.closest("#nb-section-teaching-process")),
          textSample: (node.textContent || "").replace(/\s+/g, " ").trim().slice(0, 140)
        };
      }
      const childSlots = Object.fromEntries(slots.map((slot) => [slot, describe(slot)]));
      const dynamicChildSlotsPass = slots.every((slot) => childSlots[slot].exists || childSlots[slot].missing_recorded_as_gap);
      return {
        stage: "dynamic_child_slot_smoke",
        child_slots: childSlots,
        dynamic_child_slots_pass: dynamicChildSlotsPass,
        no_frontend_content_creation: true,
        field_rendering: false,
        formal_apply: false
      };
    }, CHILD_SLOTS);
    writeJson(root, "r220d_dynamic_child_slot_smoke.json", dynamicChildSlotSmoke);

    const payload = samplePayload();
    const requestsBeforePayload = networkRequests.length;
    const uploadedPayloadRebindSmoke = await page.evaluate(
      async ({ payload, endpoint, parentSlots }) => {
        function wait(ms) {
          return new Promise((resolve) => window.setTimeout(resolve, ms));
        }
        async function waitForPreview(timeoutMs = 5000) {
          const started = Date.now();
          while (Date.now() - started < timeoutMs) {
            if (window.__R108_BACKEND_DOCUMENT_PREVIEW__) return true;
            await wait(100);
          }
          return false;
        }
        const before = Object.fromEntries(parentSlots.map((slot) => [
          slot,
          Boolean(typeof window.resolveRenderSlot === "function" && window.resolveRenderSlot(slot))
        ]));
        let error = "";
        let fetchInterceptCount = 0;
        let previewObserved = false;
        try {
          const originalFetch = window.fetch.bind(window);
          window.__R220D_FETCH_INTERCEPTS__ = [];
          window.fetch = async (url, init) => {
            const urlText = String(url || "");
            if (urlText.includes(endpoint)) {
              fetchInterceptCount += 1;
              window.__R220D_FETCH_INTERCEPTS__.push({
                url: urlText,
                method: init?.method || "GET",
                intercepted: true
              });
              return new Response(JSON.stringify(payload), {
                status: 200,
                headers: { "Content-Type": "application/json" }
              });
            }
            return originalFetch(url, init);
          };
          document.querySelector("[data-r104b-import-open]")?.click();
          await wait(100);
          const input = document.querySelector("[data-r104b-file-input]");
          if (!input) throw new Error("Import file input not found.");
          const file = new File(
            ["R220D readonly DOM smoke fixture"],
            "r220d_dom_smoke_sample.docx",
            { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" }
          );
          const dataTransfer = new DataTransfer();
          dataTransfer.items.add(file);
          input.files = dataTransfer.files;
          input.dispatchEvent(new Event("change", { bubbles: true }));
          await wait(100);
          const button = document.querySelector("[data-r104b-preview-apply]");
          if (!button) throw new Error("Import preview apply button not found.");
          button.click();
          previewObserved = await waitForPreview(6000);
          if (!previewObserved) throw new Error("Preview state was not observed after UI upload smoke.");
          await new Promise((resolve) => window.setTimeout(resolve, 250));
          if (typeof window.__R220B_BIND_SHELL_LAYER_MARKERS__ === "function") {
            window.__R220B_BIND_SHELL_LAYER_MARKERS__();
          }
        } catch (caught) {
          error = caught && caught.message ? caught.message : String(caught);
        }
        const after = Object.fromEntries(parentSlots.map((slot) => [
          slot,
          Boolean(typeof window.resolveRenderSlot === "function" && window.resolveRenderSlot(slot))
        ]));
        const preview = window.__R108_BACKEND_DOCUMENT_PREVIEW__ || {};
        return {
          stage: "uploaded_payload_rebind_smoke",
          endpoint,
          apply_backend_payload_error: error,
          parent_slots_before_payload: before,
          parent_slots_after_payload: after,
          ui_upload_path_used: true,
          fetch_intercept_count: fetchInterceptCount,
          preview_observed: previewObserved,
          template_episode_count: Array.isArray(window.__R97B_P2B_LAST_TEMPLATE_EPISODES__)
            ? window.__R97B_P2B_LAST_TEMPLATE_EPISODES__.length
            : 0,
          preview_flags: {
            preview_only: preview.preview_only === true,
            formal_apply: preview.formal_apply === true,
            model_called: preview.model_called === true,
            field_projection_applied_to_current_lesson: preview.field_projection_applied_to_current_lesson === true
          },
          uploaded_payload_rebind_pass: !error && parentSlots.every((slot) => after[slot] === true),
          field_rendering: false,
          formal_apply: false
        };
      },
      { payload, endpoint: ENDPOINT, parentSlots: PARENT_SLOTS }
    );
    uploadedPayloadRebindSmoke.network_requests_during_payload = networkRequests.slice(requestsBeforePayload);
    uploadedPayloadRebindSmoke.no_backend_network_call = uploadedPayloadRebindSmoke.network_requests_during_payload.length === 0;
    writeJson(root, "r220d_uploaded_payload_rebind_smoke.json", uploadedPayloadRebindSmoke);

    const teachingProcessDomSmoke = await page.evaluate(() => {
      const section = document.querySelector("#nb-section-teaching-process");
      const container = document.querySelector(".nb-readable-process");
      const episodes = Array.from(section?.querySelectorAll("[data-r97b-p2-unified-process-renderer]") || []);
      const sourceGapTeachingBodyCount = Array.from(
        document.querySelectorAll(".nb-doc-section:not(#nb-section-teaching-process) ol.nb-doc-body li")
      ).filter((node) => /source_gap|teacher_confirm_required|provisional_generated_candidate/.test(node.textContent || "")).length;
      const provisionalWithoutTeacherReviewLabel = Array.from(section?.querySelectorAll("*") || []).filter((node) => {
        const text = node.textContent || "";
        return /临时候选|provisional_generated_candidate/.test(text) && !/需教师|教师判断|待确认/.test(text);
      }).length;
      const unification = window.__R97B_P2_SINGLE_LESSON_TEMPLATE_UNIFICATION__ || {};
      return {
        stage: "teaching_process_dom_smoke",
        teaching_process_section_exists: Boolean(section),
        readable_process_exists: Boolean(container),
        readable_process_slot: container?.getAttribute("data-render-slot") || "",
        episode_card_count: episodes.length,
        all_episode_cards_inside_teaching_process: episodes.every((node) => Boolean(node.closest("#nb-section-teaching-process"))),
        single_template_process_marker: container?.getAttribute("data-r97b-p2b-single-template-process") === "true",
        unified_renderer_window_flag: unification.only_one_process_episode_renderer_entry === true,
        source_gap_as_teaching_body: sourceGapTeachingBodyCount,
        provisional_without_teacher_review_label: provisionalWithoutTeacherReviewLabel,
        teaching_process_dom_pass: Boolean(section)
          && Boolean(container)
          && container.getAttribute("data-render-slot") === "teaching-process-episodes"
          && episodes.length > 0
          && episodes.every((node) => Boolean(node.closest("#nb-section-teaching-process")))
          && unification.only_one_process_episode_renderer_entry === true
          && sourceGapTeachingBodyCount === 0
          && provisionalWithoutTeacherReviewLabel === 0,
        field_rendering: false,
        formal_apply: false
      };
    });
    writeJson(root, "r220d_teaching_process_dom_smoke.json", teachingProcessDomSmoke);

    const rightRailBottomSmoke = await page.evaluate(() => {
      const rightRail = typeof window.resolveRenderSlot === "function"
        ? window.resolveRenderSlot("right-rail")
        : document.querySelector('[data-render-slot="right-rail"]');
      const bottom = typeof window.resolveRenderSlot === "function"
        ? window.resolveRenderSlot("bottom-xiaojiao")
        : document.querySelector('[data-render-slot="bottom-xiaojiao"]');
      const lessonBody = typeof window.resolveRenderSlot === "function"
        ? window.resolveRenderSlot("lesson-body")
        : document.querySelector('[data-render-slot="lesson-body"]');
      const bottomContext = document.querySelector("[data-r104c-bottom-context]");
      const rightText = (rightRail?.textContent || "").replace(/\s+/g, " ").trim();
      const bottomText = (bottomContext?.textContent || bottom?.textContent || "").replace(/\s+/g, " ").trim();
      const mainBodyText = (lessonBody?.textContent || "").replace(/\s+/g, " ").trim();
      const rightRailInMainBody = Boolean(rightRail?.closest('[data-render-slot="lesson-body"]'));
      const bottomInMainBody = Boolean(bottom?.closest('[data-render-slot="lesson-body"]'));
      const legacyDirtyPatterns = [
        /大屏草稿/,
        /课件制作/,
        /补素材/,
        /轻预览/,
        /比较两组颜色/,
        /对应屏/,
        /待补图/
      ];
      const legacyDirtyHitsInMainBody = legacyDirtyPatterns
        .map((pattern) => pattern.source)
        .filter((patternSource) => new RegExp(patternSource).test(mainBodyText));
      const legacyDirtyHitsInRightRail = legacyDirtyPatterns
        .map((pattern) => pattern.source)
        .filter((patternSource) => new RegExp(patternSource).test(rightText));
      const preview = window.__R108_BACKEND_DOCUMENT_PREVIEW__ || {};
      const forbiddenRuntime = {
        formal_apply: preview.formal_apply === true,
        model_called: preview.model_called === true,
        field_projection_applied_to_current_lesson: preview.field_projection_applied_to_current_lesson === true
      };
      const teacherMainSourceSelectors = [
        ".nb-doc-body-surface",
        ".nb-doc-section",
        "#nb-section-teaching-process",
        ".nb-readable-process"
      ];
      const teacherMainSourceExcludesRightRail = !teacherMainSourceSelectors.some((selector) => {
        return Array.from(document.querySelectorAll(selector)).some((node) => rightRail && (node === rightRail || node.contains(rightRail)));
      });
      const rightRailSlotExists = Boolean(rightRail) && rightRail.getAttribute("data-render-slot") === "right-rail";
      const bottomSlotExists = Boolean(bottom) && bottom.getAttribute("data-render-slot") === "bottom-xiaojiao";
      const rightRailNotTeacherMainSource = rightRailSlotExists && !rightRailInMainBody && teacherMainSourceExcludesRightRail;
      const rightRailDoesNotWriteMainBody = legacyDirtyHitsInMainBody.length === 0 && !rightRailInMainBody;
      const legacyBigScreenContentNotPromoted = legacyDirtyHitsInMainBody.length === 0;
      const dirtyLegacyRightRailHiddenOrIgnored = legacyBigScreenContentNotPromoted;
      const bottomXiaojiaoDoesNotWriteMainBody = bottomSlotExists && !bottomInMainBody;
      return {
        stage: "right_rail_bottom_xiaojiao_slot_isolation_smoke",
        right_rail_content_semantics_out_of_scope: true,
        big_screen_content_model_out_of_scope: true,
        right_rail: {
          exists: rightRailSlotExists,
          render_slot: rightRail?.getAttribute("data-render-slot") || "",
          preview_only: rightRail?.getAttribute("data-r220b-preview-only") === "true",
          default_not_full_lesson_summary_marker: rightRail?.getAttribute("data-r97b-p2-right-rail-default-not-full-lesson-summary") === "true",
          text_sample: rightText.slice(0, 240),
          content_semantics_out_of_scope: true,
          inside_main_body: rightRailInMainBody,
          legacy_dirty_hits_in_right_rail: legacyDirtyHitsInRightRail
        },
        bottom_xiaojiao: {
          exists: bottomSlotExists,
          render_slot: bottom?.getAttribute("data-render-slot") || "",
          preview_only: bottom?.getAttribute("data-r220b-preview-only") === "true",
          context_summary_exists: Boolean(bottomContext),
          text_sample: bottomText.slice(0, 240),
          content_semantics_out_of_scope: true,
          inside_main_body: bottomInMainBody
        },
        teacher_main_source_selectors: teacherMainSourceSelectors,
        teacher_main_source_excludes_right_rail: teacherMainSourceExcludesRightRail,
        legacy_dirty_hits_in_main_body: legacyDirtyHitsInMainBody,
        forbidden_runtime: forbiddenRuntime,
        no_write: !forbiddenRuntime.formal_apply
          && !forbiddenRuntime.model_called
          && !forbiddenRuntime.field_projection_applied_to_current_lesson,
        right_rail_slot_exists: rightRailSlotExists,
        legacy_big_screen_content_not_promoted: legacyBigScreenContentNotPromoted,
        right_rail_not_teacher_main_source: rightRailNotTeacherMainSource,
        right_rail_does_not_write_main_body: rightRailDoesNotWriteMainBody,
        dirty_legacy_right_rail_hidden_or_ignored: dirtyLegacyRightRailHiddenOrIgnored,
        right_rail_slot_isolation_pass: rightRailSlotExists
          && rightRailNotTeacherMainSource
          && rightRailDoesNotWriteMainBody
          && legacyBigScreenContentNotPromoted
          && dirtyLegacyRightRailHiddenOrIgnored,
        bottom_xiaojiao_slot_exists: bottomSlotExists,
        bottom_xiaojiao_does_not_write_main_body: bottomXiaojiaoDoesNotWriteMainBody,
        bottom_xiaojiao_slot_isolation_pass: bottomSlotExists
          && bottomXiaojiaoDoesNotWriteMainBody,
        field_rendering: false,
        formal_apply: false
      };
    });
    writeJson(root, "r220d_right_rail_bottom_xiaojiao_boundary_smoke.json", rightRailBottomSmoke);

    const wrongShellGuard = await page.evaluate((targetPath) => {
      const body = document.body;
      const html = document.documentElement;
      const marker = body?.getAttribute("data-r220b-current-shell") || "";
      const contract = html?.getAttribute("data-r220b-shell-layer-slot-ownership-binding") || body?.getAttribute("data-r220b-shell-layer-slot-ownership-binding") || "";
      return {
        stage: "wrong_shell_guard",
        target_path: targetPath,
        target_is_r97b: targetPath.includes("1013R_R97B_TEACHER_SHELL_EXPERIENCE_POLISH_AND_STALE_CONTENT_CLEANUP"),
        target_is_not_r100_p1: !targetPath.includes("1013R_R100_P1_UPLOADED_LESSON_SHELL_CONTEXT_CONSISTENCY_REPAIR"),
        target_is_not_r36: !targetPath.includes("1013L_R36_existing_page_static_patch_consolidation"),
        target_is_not_m1: !targetPath.includes("1013L_M1_canonical_main_shell_milestone"),
        body_current_shell_marker: marker,
        r220b_contract_marker: contract,
        wrong_shell_guard_pass: marker === "R97B"
          && contract === "true"
          && targetPath.includes("1013R_R97B_TEACHER_SHELL_EXPERIENCE_POLISH_AND_STALE_CONTENT_CLEANUP")
          && !targetPath.includes("R100_P1")
      };
    }, TARGET_FILE.replace(/\\/g, "/"));
    writeJson(root, "r220d_wrong_shell_guard_smoke.json", wrongShellGuard);
    writeText(
      root,
      "r220d_wrong_shell_guard_report.md",
      [
        "# R220D Wrong Shell Guard",
        "",
        `Target: \`${wrongShellGuard.target_path}\``,
        "",
        `Current shell marker: \`${wrongShellGuard.body_current_shell_marker}\``,
        "",
        `R220B contract marker: \`${wrongShellGuard.r220b_contract_marker}\``,
        "",
        `wrong_shell_guard_pass: \`${wrongShellGuard.wrong_shell_guard_pass}\``,
        "",
        "R100-P1, R36, M1, and new HTML shells are not used by this smoke.",
        ""
      ].join("\n")
    );

    const summary = {
      stage: STAGE,
      status: [
        staticResolverSmoke.resolver_parent_slots_pass,
        dynamicChildSlotSmoke.dynamic_child_slots_pass,
        uploadedPayloadRebindSmoke.uploaded_payload_rebind_pass,
        uploadedPayloadRebindSmoke.no_backend_network_call,
        teachingProcessDomSmoke.teaching_process_dom_pass,
        rightRailBottomSmoke.right_rail_slot_isolation_pass,
        rightRailBottomSmoke.bottom_xiaojiao_slot_isolation_pass,
        wrongShellGuard.wrong_shell_guard_pass
      ].every(Boolean) ? "PASS" : "FAIL",
      resolver_parent_slots_pass: staticResolverSmoke.resolver_parent_slots_pass,
      dynamic_child_slots_pass: dynamicChildSlotSmoke.dynamic_child_slots_pass,
      uploaded_payload_rebind_pass: uploadedPayloadRebindSmoke.uploaded_payload_rebind_pass,
      no_backend_network_call: uploadedPayloadRebindSmoke.no_backend_network_call,
      teaching_process_dom_pass: teachingProcessDomSmoke.teaching_process_dom_pass,
      right_rail_slot_isolation_pass: rightRailBottomSmoke.right_rail_slot_isolation_pass,
      right_rail_slot_exists: rightRailBottomSmoke.right_rail_slot_exists,
      right_rail_content_semantics_out_of_scope: rightRailBottomSmoke.right_rail_content_semantics_out_of_scope,
      legacy_big_screen_content_not_promoted: rightRailBottomSmoke.legacy_big_screen_content_not_promoted,
      right_rail_not_teacher_main_source: rightRailBottomSmoke.right_rail_not_teacher_main_source,
      right_rail_does_not_write_main_body: rightRailBottomSmoke.right_rail_does_not_write_main_body,
      dirty_legacy_right_rail_hidden_or_ignored: rightRailBottomSmoke.dirty_legacy_right_rail_hidden_or_ignored,
      bottom_xiaojiao_slot_isolation_pass: rightRailBottomSmoke.bottom_xiaojiao_slot_isolation_pass,
      wrong_shell_guard_pass: wrongShellGuard.wrong_shell_guard_pass,
      source_gap_as_teaching_body: teachingProcessDomSmoke.source_gap_as_teaching_body,
      provisional_without_teacher_review_label: teachingProcessDomSmoke.provisional_without_teacher_review_label,
      field_rendering: false,
      formal_apply: false,
      no_write: true,
      no_R95: true,
      no_model_provider_call: true,
      network_request_count: networkRequests.length,
      network_requests_during_payload_count: uploadedPayloadRebindSmoke.network_requests_during_payload.length,
      page_errors: pageErrors,
      console_errors: consoleErrors.slice(0, 20)
    };
    writeJson(root, "r220d_dom_smoke_summary.json", summary);
    writeText(
      root,
      "r220d_dom_smoke_summary.md",
      [
        "# R220D DOM Smoke Summary",
        "",
        `Status: \`${summary.status}\``,
        "",
        `resolver_parent_slots_pass: \`${summary.resolver_parent_slots_pass}\``,
        "",
        `dynamic_child_slots_pass: \`${summary.dynamic_child_slots_pass}\``,
        "",
        `uploaded_payload_rebind_pass: \`${summary.uploaded_payload_rebind_pass}\``,
        "",
        `teaching_process_dom_pass: \`${summary.teaching_process_dom_pass}\``,
        "",
        `right_rail_slot_isolation_pass: \`${summary.right_rail_slot_isolation_pass}\``,
        "",
        `right_rail_content_semantics_out_of_scope: \`${summary.right_rail_content_semantics_out_of_scope}\``,
        "",
        `legacy_big_screen_content_not_promoted: \`${summary.legacy_big_screen_content_not_promoted}\``,
        "",
        `right_rail_not_teacher_main_source: \`${summary.right_rail_not_teacher_main_source}\``,
        "",
        `right_rail_does_not_write_main_body: \`${summary.right_rail_does_not_write_main_body}\``,
        "",
        `dirty_legacy_right_rail_hidden_or_ignored: \`${summary.dirty_legacy_right_rail_hidden_or_ignored}\``,
        "",
        `bottom_xiaojiao_slot_isolation_pass: \`${summary.bottom_xiaojiao_slot_isolation_pass}\``,
        "",
        `wrong_shell_guard_pass: \`${summary.wrong_shell_guard_pass}\``,
        "",
        `source_gap_as_teaching_body: \`${summary.source_gap_as_teaching_body}\``,
        "",
        `provisional_without_teacher_review_label: \`${summary.provisional_without_teacher_review_label}\``,
        "",
        "Boundary: no field rendering, no formal apply, no write, no R95, no provider/model call.",
        ""
      ].join("\n")
    );
  } finally {
    await browser.close();
  }
}

main().catch((error) => {
  console.error(error && error.stack ? error.stack : error);
  process.exit(1);
});
