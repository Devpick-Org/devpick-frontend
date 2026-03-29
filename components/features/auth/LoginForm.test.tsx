import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LoginForm } from "./LoginForm";
import { authEndpoints } from "@/lib/api/endpoints/auth";
import { useAuthStore } from "@/store/auth.store";
import { useRouter } from "next/navigation";

// --- 모킹 ---

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("@/store/auth.store", () => ({
  useAuthStore: jest.fn(),
}));

jest.mock("@/lib/api/endpoints/auth", () => ({
  authEndpoints: {
    login: jest.fn(),
    getMe: jest.fn(),
  },
}));

// --- 공통 셋업 ---

const mockPush = jest.fn();
const mockSetAuth = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();
  (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
  (useAuthStore as unknown as jest.Mock).mockImplementation((selector) =>
    selector({ setAuth: mockSetAuth })
  );
});

// --- 테스트 ---

describe("LoginForm", () => {
  it("이메일과 비밀번호 입력칸이 렌더링된다", () => {
    // given / when
    render(<LoginForm />);

    // then
    expect(screen.getByLabelText("이메일")).toBeInTheDocument();
    expect(screen.getByLabelText("비밀번호")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "로그인" })).toBeInTheDocument();
  });

  it("잘못된 이메일 형식 입력 시 에러 메시지가 표시된다", async () => {
    // given
    render(<LoginForm />);
    const user = userEvent.setup();

    // when
    await user.type(screen.getByLabelText("이메일"), "invalid-email");

    // then
    expect(
      screen.getByText("올바른 이메일 형식을 입력해주세요.")
    ).toBeInTheDocument();
  });

  it("빈 값 제출 시 로그인 API가 호출되지 않는다", async () => {
    // given
    render(<LoginForm />);
    const user = userEvent.setup();

    // when
    await user.click(screen.getByRole("button", { name: "로그인" }));

    // then
    expect(authEndpoints.login).not.toHaveBeenCalled();
  });

  it("올바른 값 입력 후 제출 시 로그인 API가 호출되고 홈으로 이동한다", async () => {
    // given
    (authEndpoints.login as jest.Mock).mockResolvedValue({
      data: {
        data: { accessToken: "token", userId: "1", nickname: "테스터" },
      },
    });
    (authEndpoints.getMe as jest.Mock).mockResolvedValue({
      data: {
        data: { userId: "1", email: "test@test.com", nickname: "테스터" },
      },
    });

    render(<LoginForm />);
    const user = userEvent.setup();

    // when
    await user.type(screen.getByLabelText("이메일"), "test@test.com");
    await user.type(screen.getByLabelText("비밀번호"), "Password1!");
    await user.click(screen.getByRole("button", { name: "로그인" }));

    // then
    await waitFor(() => {
      expect(authEndpoints.login).toHaveBeenCalledWith({
        email: "test@test.com",
        password: "Password1!",
      });
      expect(mockSetAuth).toHaveBeenCalled();
      expect(mockPush).toHaveBeenCalledWith("/home");
    });
  });
});
