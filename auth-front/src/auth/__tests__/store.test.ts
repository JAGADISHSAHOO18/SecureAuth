import { act } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import useAuth from "@/auth/store";
import * as authService from "@/services/AuthService";

vi.mock("@/services/AuthService", () => ({
  loginUser: vi.fn(),
  logoutUser: vi.fn(),
  refreshToken: vi.fn(),
}));

const user = {
  id: "1",
  email: "test@example.com",
  name: "Test User",
  enabled: true,
  emailVerified: true,
  provider: "LOCAL",
  roles: ["ROLE_GUEST"],
};

describe("auth store", () => {
  beforeEach(() => {
    useAuth.getState().clearSession();
    vi.clearAllMocks();
  });

  it("stores a successful session", async () => {
    vi.mocked(authService.loginUser).mockResolvedValue({
      accessToken: "access",
      tokenType: "Bearer",
      expiresIn: 900,
      user,
    });

    await act(async () => {
      await useAuth.getState().login({
        email: "test@example.com",
        password: "password123",
      });
    });

    expect(useAuth.getState().checkLogin()).toBe(true);
    expect(useAuth.getState().user?.email).toBe("test@example.com");
  });

  it("clears the session on logout", async () => {
    vi.mocked(authService.logoutUser).mockResolvedValue();

    act(() => useAuth.getState().setSession("access", user));

    await act(async () => {
      await useAuth.getState().logout();
    });

    expect(useAuth.getState().checkLogin()).toBe(false);
    expect(useAuth.getState().user).toBeNull();
  });
});
