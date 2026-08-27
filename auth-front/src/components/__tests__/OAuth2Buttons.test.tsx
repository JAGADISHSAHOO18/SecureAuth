import { render, screen } from "@testing-library/react";
import OAuth2Buttons from "@/components/OAuth2Buttons";
import { describe, expect, it } from "vitest";

describe("OAuth2Buttons", () => {
  it("renders both identity providers", () => {
    render(<OAuth2Buttons />);
    expect(screen.getByText("Continue with Google")).toBeInTheDocument();
    expect(screen.getByText("Continue with GitHub")).toBeInTheDocument();
  });
});
