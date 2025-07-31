import { expect, Locator, Page } from "@playwright/test";

export async function checkInputAttributes(page: Page, spec: {
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  readonly?: boolean;
  disabled?: boolean;
  maxlength?: string;
  value?: string;
  autocomplete?: string;
}) {
 console.log("specs", spec)
  const input = page.locator(`[name="${spec.name}"]`);

  if (spec.type !== undefined) {
    await expect(input).toHaveAttribute("type", spec.type);
  }

  if (spec.placeholder !== undefined) {
    await expect(input).toHaveAttribute("placeholder", spec.placeholder);
  }

  if (spec.required !== undefined) {
    if (spec.required) {
      await expect(input).toHaveAttribute("required", "");
    } else {
      await expect(input).not.toHaveAttribute("required", "");
    }
  }

  if (spec.readonly !== undefined) {
    if (spec.readonly) {
      await expect(input).toHaveAttribute("readonly", "");
    } else {
      await expect(input).not.toHaveAttribute("readonly", "");
    }
  }

  if (spec.disabled !== undefined) {
    if (spec.disabled) {
      await expect(input).toBeDisabled();
    } else {
      await expect(input).toBeEnabled();
    }
  }

  if (spec.maxlength !== undefined) {
    await expect(input).toHaveAttribute("maxlength", spec.maxlength);
  }

  if (spec.autocomplete !== undefined) {
    await expect(input).toHaveAttribute("autocomplete", spec.autocomplete);
  }

  if (spec.value !== undefined) {
    await input.fill(spec.value); // Set the value first
    await expect(input).toHaveValue(spec.value);
  }
}


