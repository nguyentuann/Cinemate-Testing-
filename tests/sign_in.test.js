import fs from "fs";
import { createDriver, quitDriver } from "../config/driver.js";
import { signInData } from "../data/signInData.js";
import { writeLog } from "../helper/writeLog.js";
import { typeIntoField } from "../helper/typeIntoTextFiled.js";
import { getErrorText } from "../helper/getErrorTextField.js";
import { logFile } from "../constant/path_file.js";

// --- main test ---
async function runSignInTest() {
  var index = 0;
  const driver = await createDriver();

  if (fs.existsSync(logFile)) fs.writeFileSync(logFile, "", "utf-8");

  try {
    for (const { email, password } of signInData) {
      writeLog(`\n🧪 Starting test with email: ${email}`);

      // todo nhập email
      await typeIntoField(
        driver,
        "~sign_in_email_text_field",
        email,
        "Email",
        index > 0
      );
      // todo nhập password
      await typeIntoField(
        driver,
        "~sign_in_password_text_field",
        password,
        "Password",
        index > 0
      );
      index++;

      // --- click login ---
      const loginButton = await driver.$("~sign_in_button");
      await loginButton.waitForDisplayed({ timeout: 5000 });
      await loginButton.waitForEnabled({ timeout: 5000 });
      await loginButton.click();
      await driver.pause(5000);

      // --- kiểm tra lỗi ---
      const emailErrorText = await getErrorText(
        driver,
        "~email_error_message",
        "Email Error"
      );
      const passwordErrorText = await getErrorText(
        driver,
        "~password_error_message",
        "Password Error"
      );
      const apiErrorText = await getErrorText(
        driver,
        "~sign_in_api_message",
        "API Error"
      );

      // todo --- xác nhận kết quả ---
      if (emailErrorText || passwordErrorText || apiErrorText) {
        // Có ít nhất 1 lỗi
        if (emailErrorText) {
          writeLog(`Email Error: ${emailErrorText}`);
        }

        if (passwordErrorText) {
          writeLog(`Password Error: ${passwordErrorText}`);
        }

        if (apiErrorText) {
          writeLog(`API Error: ${apiErrorText}`);

          // === Nhấn OK để đóng popup ===
          const okButton = await driver.$("~ok_error_button");
          const isOkDisplayed = await okButton.isDisplayed().catch(() => false);

          if (isOkDisplayed) {
            await okButton.click();
            await driver.pause(1000); // đợi popup đóng
          } else {
          }
        }
      } else {
        // Không có lỗi nào
        writeLog("✅ Login successful (no validation errors)");
      }
    }
  } catch (err) {
    writeLog(`❌ Test failed: ${err.message}`);
    throw err;
  } finally {
    await quitDriver(driver);
    writeLog("\n🏁 Test completed.\n");
  }
}

runSignInTest().catch(console.error);
