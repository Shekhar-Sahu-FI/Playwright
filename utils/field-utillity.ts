import { expect, Locator, Page, test } from '@playwright/test';
type FieldSpec = {
  field: Locator;
  label?: string;
  expectedValues?: string[];
  selectedValue?: string;
  maxlength?: number;
  minlength?: number;
  mandatory?: boolean;
  readonly?: boolean;
  disabled?: boolean;
  placeholder?: string;
  defaultValue?: string;
  caseType?: 'upper' | 'lower' | 'none';
  type?: string;
  allowSpecialChars?: boolean;
  trimCheck?: boolean;
};

export async function fieldParameterCheck(fields: FieldSpec[], page: Page) {
  for (const ele of fields) {
    await test.step(`Checking field: ${ele.label || 'Unnamed Field'}`, async () => {
      //  Check mandatory label
      if (ele.label && ele.mandatory) {
        const labelLocator = page.locator(`label:has-text("${ele.label}")`);
        const star = labelLocator.locator('span.text-destructive');
        await expect.soft(star, `${ele.label} should have * mark for mandatory`).toHaveText('*');
      }

      //  Check disabled/enabled
      if (ele.disabled) {
        await expect.soft(ele.field, `${ele.label} should be disabled`).toBeDisabled();
      }

      if (ele.type === 'text' || ele.type === 'textarea' || ele.type === 'email') {
        await textFieldParameter(ele, page);
      }

      if (ele.type === 'dropdown') {
        await dropdownFieldParameter(ele, page);
      }
    });
  }
}

export async function checkTabOrderByFocus(page: Page, expectedFields: Locator[]) {
  if (!expectedFields || expectedFields.length === 0) return;

  await expectedFields[0].click();

  for (let i = 1; i < expectedFields.length; i++) {
    await page.keyboard.press('Tab');
    await expect.soft(expectedFields[i]).toBeFocused();
  }
}

export async function textFieldParameter(field: FieldSpec, page: Page) {
  // 1️⃣ Max length check
  if (field.maxlength) {
    await expect
      .soft(field.field, `${field.label} should have maxlength=${field.maxlength}`)
      .toHaveAttribute('maxlength', field.maxlength.toString());
  }

  // 2️⃣ Min length check
  if (field.minlength) {
    await expect
      .soft(field.field, `${field.label} should have minlength=${field.minlength}`)
      .toHaveAttribute('minlength', field.minlength.toString());
  }

  // 4️⃣ Readonly field check
  if (field.readonly) {
    console.log('Checking readonly for', field.label);
    await expect.soft(field.field, `${field.label} should be readonly`).toHaveAttribute('readonly', '');
  }

  // 6️⃣ Placeholder text check
  if (field.placeholder) {
    await expect
      .soft(field.field, `${field.label} should have correct placeholder`)
      .toHaveAttribute('placeholder', field.placeholder);
  }

  // 7️⃣ Default value check
  if (field.defaultValue) {
    await expect
      .soft(field.field, `${field.label} should have default value ${field.defaultValue}`)
      .toHaveValue(field.defaultValue);
  }

  // 8️⃣ Input type check
  if (field.type === 'text' || field.type === 'number') {
    await expect
      .soft(field.field, `${field.label} should have input type ${field.type}`)
      .toHaveAttribute('type', field.type);
  }

  // 9️⃣ Case type check (optional logic)
  if (field.caseType && field.caseType !== 'none') {
    const testValue = 'AbCd';
    await field.field.fill(testValue);
    const val = await field.field.inputValue();

    if (field.caseType === 'upper') {
      await expect.soft(val, `${field.label} should convert to uppercase`).toBe(testValue.toUpperCase());
    } else if (field.caseType === 'lower') {
      await expect.soft(val, `${field.label} should convert to lowercase`).toBe(testValue.toLowerCase());
    }
  }

  // 🔟 Behavior check: max length enforcement
  if (field.maxlength && field.disabled !== true && field.readonly !== true) {
    const overLimitText = 'x'.repeat(field.maxlength + 5);
    await field.field.fill(overLimitText);
    const actual = await field.field.inputValue();
    await expect
      .soft(actual.length, `${field.label} should not accept more than ${field.maxlength} characters`)
      .toBeLessThanOrEqual(field.maxlength);
  }

  //  Special character check (if disallowed)
  if (field.allowSpecialChars === false) {
    await field.field.fill('abc@#$%');
    const val = await field.field.inputValue();
    await expect.soft(/[@#$%]/.test(val), `${field.label} should not allow special characters`).toBeFalsy();
  }
}

export async function dropdownFieldParameter(ele: FieldSpec, page: Page) {
  const { field, expectedValues, selectedValue } = ele;

  // Check if dropdown exists
  await expect.soft(field, `Dropdown field missing`).toBeVisible();

  //  Check available options (for native <select> dropdowns)
  const tag = await field.evaluate((el) => {
    console.log('Tag name:', el.tagName);
    return el.tagName.toLowerCase();
  });

  if (tag === 'select' && expectedValues && expectedValues.length > 0) {
    const options = await field.locator('option').allInnerTexts();
    for (const val of expectedValues) {
      await expect.soft(options, `Expected option '${val}' missing in ${ele.label || 'dropdown'}`).toContain(val);
    }
  }

  //  Check default selected value (if provided)
  if (selectedValue) {
    if (tag === 'select') {
      const value = await field.inputValue();
      const selectedOption = await field.locator(`option[value="${value}"]`).textContent();
      await expect
        .soft(selectedOption?.trim(), `${ele.label || 'Dropdown'} should have default value '${selectedValue}'`)
        .toBe(selectedValue);
    } else {
      // For custom dropdown, check visible text
      await expect
        .soft(field, `${ele.label || 'Dropdown'} should show selected text '${selectedValue}'`)
        .toContainText(selectedValue);
    }
  }
}

// export async function fieldParameterCheck(fields: FieldSpec[], page: Page) {

//     for (const ele of fields) {
//         test.step(`Checking field: ${ele.label || 'Unnamed Field'}`, async () => {
//             if (ele.label && ele.mandatory) {
//                 const labelLocator = page.locator(`label:has-text("${ele.label}")`);
//                 const star = labelLocator.locator('span.text-destructive');
//                 await expect.soft(
//                     star,
//                     `${ele.label} should have * mark for mandatory`
//                 ).toHaveText('*');
//             }

//             //  Check disabled/enabled
//             if (ele.disabled) {
//                 await expect.soft(
//                     ele.field,
//                     `${ele.label} should be disabled`
//                 ).toBeDisabled();
//             }

//             if (ele.type === "text" || ele.type === "textarea" || ele.type === "email") {
//                 await textFieldParameter(ele, page);
//             }

//             if (ele.type === "dropdown") {
//                 await dropdownFieldParameter(ele, page);
//             }
//         });
//     }
// }

// export async function selectFromAutoSuggestion(
//   page: Page,
//   inputFields: Locator,
//   query: string,
//   valueToSelect: string,
//   index: number = 0,
// ) {
//   const timeout = 20000;

//   const inputField = inputFields.nth(index);
//   await inputField.fill('');
//   await inputField.type(query, { delay: 100 });

//   // Step 2: Define the table
//   const suggestionTable = page.locator('table:has(th:has-text("ID"))');

//   for (let i = 0; i < 10; i++) {
//     if (await suggestionTable.isVisible()) break;
//     await page.waitForTimeout(1000);
//   }

//   // Step 3: Ensure it’s visible
//   await expect(suggestionTable).toBeVisible({ timeout });

//   // Step 4: Select desired row
//   const suggestionRow = suggestionTable.locator('tr', { hasText: valueToSelect });
//   await suggestionRow.waitFor({ state: 'visible', timeout });
//   await suggestionRow.scrollIntoViewIfNeeded();
//   await suggestionRow.press('Enter');

//   await expect(inputField).toHaveValue(valueToSelect, { timeout });
// }

export async function selectFromAutoSuggestion(
  page: Page,
  inputFields: Locator,
  query: string,
  valueToSelect: string,
  index: number = 0,
) {
  const TIMEOUT = 20000;

  // ----------------------------
  // 1️⃣ Pick the input field
  // ----------------------------
  const inputField = inputFields.nth(index);

  await expect(inputField, `Input field at index ${index} is not visible`).toBeVisible({
    timeout: TIMEOUT,
  });

  await inputField.fill('');
  await inputField.type(query, { delay: 80 });

  // ----------------------------
  // 2️⃣ Wait for suggestions table
  // ----------------------------
  const suggestionTable = page.locator('table:has(th:has-text("ID"))');

  await expect
    .soft(suggestionTable, `Suggestion table did not appear for query "${query}"`)
    .toBeVisible({ timeout: TIMEOUT });

  // ----------------------------
  // 3️⃣ Find the desired row
  // ----------------------------
  const rowLocator = suggestionTable.locator('tr', {
    hasText: valueToSelect,
  });

  await rowLocator
    .waitFor({
      state: 'visible',
      timeout: TIMEOUT,
    })
    .catch(() => {
      throw new Error(`Value "${valueToSelect}" not found in suggestion list for query "${query}"`);
    });

  // Scroll to avoid hidden row click issues
  await rowLocator.scrollIntoViewIfNeeded();
  await rowLocator.press('Enter');

  // ----------------------------
  // 4️⃣ Validate selected value
  // ----------------------------
  await expect(inputField).toHaveValue(valueToSelect, {
    timeout: TIMEOUT,
  });
}

export async function fillWithRetry(locator: Locator, value: string) {
  for (let attempt = 1; attempt <= 3; attempt++) {
    await locator.fill(''); // clear
    await locator.pressSequentially(value); // type slowly & reliably
    await locator.blur();

    // wait for input value to settle
    const current = await locator.inputValue();
    if (current.trim() === value.trim()) {
      return; // success
    }

    await locator.click();
  }

  throw new Error(`❌ Failed to set value '${value}' after retries`);
}
