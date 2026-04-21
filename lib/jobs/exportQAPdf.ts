import html2canvas from "html2canvas-pro";
import jsPDF from "jspdf";
import type { QACategory } from "@/types/jobs";

const PAGE_WIDTH = 680;
const PAGE_PADDING_X = 40;
const PAGE_PADDING_Y = 32;

// A4 비율(세로/가로)에 맞춘 전체 페이지 높이
const PAGE_HEIGHT = Math.floor(PAGE_WIDTH * (841.89 / 595.28));

// 안전 여백 조금 더 확보
const PAGE_CONTENT_HEIGHT = PAGE_HEIGHT - PAGE_PADDING_Y * 2 - 20;

function createHiddenRoot(): HTMLDivElement {
  const root = document.createElement("div");
  root.style.cssText = `
    position: absolute;
    left: -99999px;
    top: 0;
    width: ${PAGE_WIDTH}px;
    background: #ffffff;
    box-sizing: border-box;
    font-family: Pretendard, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    color: #111827;
  `;
  document.body.appendChild(root);
  return root;
}

function createPage(): HTMLDivElement {
  const page = document.createElement("div");
  page.style.cssText = `
    width: ${PAGE_WIDTH}px;
    height: ${PAGE_HEIGHT}px;
    background: #ffffff;
    box-sizing: border-box;
    padding: ${PAGE_PADDING_Y}px ${PAGE_PADDING_X}px;
    overflow: hidden;
  `;
  return page;
}

function createTitle(): HTMLHeadingElement {
  const title = document.createElement("h1");
  title.textContent = "예상 면접 Q&A";
  title.style.cssText = `
    font-size: 18px;
    font-weight: 700;
    color: #111827;
    margin: 0 0 20px;
    padding-bottom: 12px;
    border-bottom: 2px solid #111827;
    line-height: 1.4;
  `;
  return title;
}

function createCategoryHeader(
  title: string,
  count: number,
  index: number,
): HTMLDivElement {
  const wrapper = document.createElement("div");
  wrapper.style.cssText = `
    margin: ${index === 0 ? "0" : "20px"} 0 6px;
    padding: 8px 0;
    border-bottom: 1.5px solid #e5e7eb;
  `;

  const heading = document.createElement("h2");
  heading.style.cssText = `
    margin: 0;
    font-size: 14px;
    font-weight: 700;
    color: #111827;
    line-height: 1.5;
  `;
  heading.textContent = title;

  const meta = document.createElement("span");
  meta.textContent = ` ${count}문항`;
  meta.style.cssText = `
    font-size: 11px;
    font-weight: 500;
    color: #9ca3af;
    margin-left: 6px;
  `;

  heading.appendChild(meta);
  wrapper.appendChild(heading);
  return wrapper;
}

function createItemBlock(
  question: string,
  answer: string,
  followUps: string[],
  index: number,
): HTMLDivElement {
  const block = document.createElement("div");
  block.style.cssText = `
    padding: 8px 0;
    border-bottom: 1px solid #f3f4f6;
    break-inside: avoid;
  `;

  const q = document.createElement("p");
  q.textContent = `Q${index + 1}. ${question}`;
  q.style.cssText = `
    margin: 0 0 6px;
    font-size: 12px;
    font-weight: 700;
    color: #111827;
    line-height: 1.55;
  `;

  const a = document.createElement("p");
  a.style.cssText = `
    margin: 0;
    font-size: 12px;
    color: #374151;
    line-height: 1.65;
  `;
  a.innerHTML = `<span style="font-weight:600;color:#111827;">A. </span>${answer}`;

  block.appendChild(q);
  block.appendChild(a);

  if (followUps.length > 0) {
    const followUpTitle = document.createElement("p");
    followUpTitle.textContent = "예상 꼬리 질문";
    followUpTitle.style.cssText = `
      margin: 8px 0 4px;
      font-size: 11px;
      font-weight: 600;
      color: #6b7280;
      line-height: 1.5;
    `;
    block.appendChild(followUpTitle);

    followUps.forEach((f) => {
      const p = document.createElement("p");
      p.textContent = `• ${f}`;
      p.style.cssText = `
        margin: 0 0 3px;
        padding-left: 8px;
        font-size: 11px;
        color: #6b7280;
        line-height: 1.55;
      `;
      block.appendChild(p);
    });
  }

  return block;
}

function getInnerHeight(el: HTMLElement): number {
  const style = window.getComputedStyle(el);
  const marginTop = Number.parseFloat(style.marginTop || "0");
  const marginBottom = Number.parseFloat(style.marginBottom || "0");
  return el.offsetHeight + marginTop + marginBottom;
}

export async function exportQAAsPdf(
  qa: QACategory[],
  jobId: string,
): Promise<void> {
  const root = createHiddenRoot();
  const pages: HTMLDivElement[] = [];

  try {
    let currentPage = createPage();
    root.appendChild(currentPage);
    pages.push(currentPage);

    const title = createTitle();
    currentPage.appendChild(title);

    let usedHeight = getInnerHeight(title);

    for (const [categoryIndex, category] of qa.entries()) {
      const header = createCategoryHeader(
        category.title,
        category.items.length,
        categoryIndex,
      );

      root.appendChild(header);
      const headerHeight = getInnerHeight(header);
      root.removeChild(header);

      const firstItem = createItemBlock(
        category.items[0].question,
        category.items[0].answer,
        category.items[0].followUps,
        0,
      );

      root.appendChild(firstItem);
      const firstItemHeight = getInnerHeight(firstItem);
      root.removeChild(firstItem);

      if (usedHeight + headerHeight + firstItemHeight > PAGE_CONTENT_HEIGHT) {
        currentPage = createPage();
        root.appendChild(currentPage);
        pages.push(currentPage);
        usedHeight = 0;
      }

      currentPage.appendChild(header);
      usedHeight += getInnerHeight(header);

      for (let i = 0; i < category.items.length; i++) {
        const item = category.items[i];
        const block = createItemBlock(
          item.question,
          item.answer,
          item.followUps,
          i,
        );

        root.appendChild(block);
        const blockHeight = getInnerHeight(block);
        root.removeChild(block);

        if (usedHeight + blockHeight > PAGE_CONTENT_HEIGHT) {
          currentPage = createPage();
          root.appendChild(currentPage);
          pages.push(currentPage);
          usedHeight = 0;
        }

        currentPage.appendChild(block);
        usedHeight += getInnerHeight(block);
      }
    }

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "pt",
      format: "a4",
    });

    for (let i = 0; i < pages.length; i++) {
      const canvas = await html2canvas(pages[i], {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
        logging: false,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height / canvas.width) * pdfWidth;

      if (i > 0) pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    }

    pdf.save(`interview-qa-job-${jobId}.pdf`);
  } finally {
    document.body.removeChild(root);
  }
}
