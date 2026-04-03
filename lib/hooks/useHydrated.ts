import { useSyncExternalStore } from "react";

/**
 * 서버/클라이언트 hydration 완료 여부를 반환합니다.
 *
 * - 서버 렌더링(SSR) 및 hydration 이전: false
 * - 클라이언트 hydration 완료 후: true
 *
 * useState + useEffect(() => setMounted(true), []) 패턴을
 * lint 규칙 위반 없이 대체합니다.
 */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}
