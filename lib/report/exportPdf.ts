import html2canvas from "html2canvas-pro";
import { jsPDF } from "jspdf";

const MAX_SIDE_PX = 12000;

/**
 * 하나의 세로 긴 이미지를 A4 높이에 맞춰 잘라낸 페이지들로 채워 넣는다.
 * (jsPDF 에서 하나의 장이미지를 음수 y 로 이동해 찍으면 브라우저/설정별로 마지막 장이 짤림)
 */
function addCanvasSlicedIntoPages(
  source: HTMLCanvasElement,
  pdf: jsPDF,
  pdfWidthPt: number,
  pdfHeightPt: number,
): void {
  const pxW = source.width;
  const pxH = source.height;
  if (pxW <= 0 || pxH <= 0) return;

  const ptPerPx = pdfWidthPt / pxW;
  const pagePxH = pdfHeightPt / ptPerPx;

  let topPx = 0;
  let pageIdx = 0;

  while (topPx < pxH - 0.25) {
    const slicePx = Math.min(Math.ceil(pagePxH), pxH - topPx);
    const slide = document.createElement("canvas");
    slide.width = pxW;
    slide.height = slicePx;
    const ctx = slide.getContext("2d");
    if (!ctx) throw new Error("canvas 2d context 미지원");
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, slide.width, slide.height);
    ctx.drawImage(source, 0, topPx, pxW, slicePx, 0, 0, pxW, slicePx);

    const imgData = slide.toDataURL("image/jpeg", 0.93);
    const slicePtH = slicePx * ptPerPx;

    if (pageIdx > 0) {
      pdf.addPage();
    }
    pdf.addImage(imgData, "JPEG", 0, 0, pdfWidthPt, slicePtH, undefined, "FAST");

    topPx += slicePx;
    pageIdx += 1;
  }
}

/**
 * 주어진 DOM 요소를 캡처해 PDF로 다운로드합니다.
 *
 * 파일명 예: weekly-report-2026-03-14.pdf
 * html2canvas-pro — 장문은 캔버스 슬라이스로 페이지 분할
 */
export async function exportReportAsPdf(
  element: HTMLElement,
  weekStart: string,
): Promise<void> {
  if (typeof document !== "undefined" && document.fonts?.ready) {
    await document.fonts.ready.catch(() => undefined);
  }

  /** 숨김 영역이라도 레이아웃이 잡히도록 하는 최소 기준 높이 (scrollHeight 신뢰 실패 보완) */
  const w = Math.max(element.scrollWidth, element.offsetWidth, 1);
  const h = Math.max(element.scrollHeight, element.offsetHeight, 1);

  const maxDim = Math.max(w, h);
  const requestedScale =
    typeof window !== "undefined" && typeof window.devicePixelRatio === "number"
      ? Math.min(2, window.devicePixelRatio + 0.25)
      : 2;

  /** 브라우저 캔버스 크기 안전 영역 초과 방지 — 스케일만 낮춤 */
  const scale = Math.min(requestedScale, MAX_SIDE_PX / maxDim / 2);

  const canvas = await html2canvas(element, {
    scale: Math.max(1, Number(scale.toFixed(2))),
    width: w,
    height: h,
    useCORS: true,
    allowTaint: true,
    backgroundColor: "#ffffff",
    logging: false,
    scrollX: 0,
    scrollY: 0,
    windowWidth: w,
    windowHeight: h,
    x: 0,
    y: 0,
  });

  const pdf = new jsPDF({ orientation: "portrait", unit: "pt", format: "a4" });
  const pdfW = pdf.internal.pageSize.getWidth();
  const pdfH = pdf.internal.pageSize.getHeight();

  /** 한 페이지 안에 들어가면 바로 장착, 아니면 슬라이스 */
  const imgScaledH = (canvas.height / canvas.width) * pdfW;
  if (imgScaledH <= pdfH + 0.75) {
    pdf.addImage(
      canvas.toDataURL("image/jpeg", 0.93),
      "JPEG",
      0,
      0,
      pdfW,
      imgScaledH,
      undefined,
      "FAST",
    );
  } else {
    addCanvasSlicedIntoPages(canvas, pdf, pdfW, pdfH);
  }

  pdf.save(`weekly-report-${weekStart}.pdf`);
}
