import html2canvas from "html2canvas-pro";
import jsPDF from "jspdf";

/**
 * 주어진 DOM 요소를 캡처해 PDF로 다운로드합니다.
 * 파일명 예: weekly-report-2026-03-14.pdf
 *
 * html2canvas-pro 사용 — oklch/lab 등 최신 CSS 색상 함수 네이티브 지원
 * A4 너비 기준 비율 유지, 1페이지 초과 시 자동 분할
 */
export async function exportReportAsPdf(
  element: HTMLElement,
  weekStart: string,
): Promise<void> {
  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    backgroundColor: "#ffffff",
    logging: false,
  });

  const imgData = canvas.toDataURL("image/png");

  const pdf = new jsPDF({ orientation: "portrait", unit: "pt", format: "a4" });
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = pdf.internal.pageSize.getHeight();

  const imgWidth = pdfWidth;
  const imgHeight = (canvas.height / canvas.width) * pdfWidth;

  if (imgHeight <= pdfHeight) {
    pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
  } else {
    let yOffset = 0;
    while (yOffset < imgHeight) {
      if (yOffset > 0) pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, -yOffset, imgWidth, imgHeight);
      yOffset += pdfHeight;
    }
  }

  pdf.save(`weekly-report-${weekStart}.pdf`);
}
