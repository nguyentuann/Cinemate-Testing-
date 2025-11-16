import { TIMEOUT_CONSTANT } from "../constant/time_constant.js";
import { clearTextField } from "./clearTextField.js";
import { writeLog } from "./writeLog.js";

export async function typeIntoField(
  driver,
  selector,
  value,
  fieldName,
  clearData = false,
  logFile
) {
  const field = await driver.$(selector);
  await field.waitForDisplayed({ timeout: TIMEOUT_CONSTANT });
  await field.waitForEnabled({ timeout: TIMEOUT_CONSTANT });

  writeLog(logFile, `🖋 Focusing ${fieldName}`);
  await field.click();
  await driver.pressKeyCode(123); // todo move to end of text

  if (clearData) await clearTextField(driver, field, 30);

  await driver.pause(300);

  writeLog(logFile, `⌨️ Typing "${value}" into ${fieldName}`);
  await driver.executeScript("mobile: type", [
    { elementId: field.elementId, text: value },
  ]);

  return field;
}
