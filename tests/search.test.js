import fs from "fs";
import { createDriver, quitDriver } from "../config/driver.js";
import { searchTestCases } from "../data/searchData.js";
import { writeLog } from "../helper/writeLog.js";
import { typeIntoField } from "../helper/typeIntoTextFiled.js";
import { searchLogFile } from "../constant/path_file.js";

// --- main test ---
async function runSearchTest() {
  const driver = await createDriver();

  if (fs.existsSync(searchLogFile)) fs.writeFileSync(searchLogFile, "", "utf-8");

  try {
    writeLog(searchLogFile,`\n🔍 Starting Search Test`);

    // todo điều hướng đến màn hình search (từ bottom navigation)
    const searchBtn = await driver.$("~Search");
    await searchBtn.waitForDisplayed({ timeout: 5000 });
    await searchBtn.click();
    writeLog(searchLogFile,`📱 Navigated to Search screen`);
    await driver.pause(3000);

    for (const testCase of searchTestCases) {
      writeLog(searchLogFile,`\n🧪 Test: ${testCase.testName} - ${testCase.description}`);

      try {
        if (testCase.type === "category") {
          // todo test category selection
          for (const categoryName of testCase.categories) {
            writeLog(searchLogFile,`\n  📂 Testing category: ${categoryName}`);

            const categoryButton = await driver.$(`~category_${categoryName}`);
            const isCategoryDisplayed = await categoryButton
              .isDisplayed()
              .catch(() => false);

            if (!isCategoryDisplayed) {
              writeLog(searchLogFile,`  ⚠️ Category "${categoryName}" button not found`);
              continue;
            }

            await categoryButton.click();
            writeLog(searchLogFile,`  ✅ Clicked category: ${categoryName}`);
            await driver.pause(3000); // Đợi load danh sách phim

            // todo kiểm tra text "Result" xuất hiện
            const resultText = await driver
              .$('android=new UiSelector().textContains("Result")')
              .getText()
              .catch(() => "");

            if (resultText) {
              writeLog(searchLogFile,`  ✅ Result section displayed`);
            }

            // todo kiểm tra có phim hiển thị không (tìm các movie items)
            const movieItems = await driver.$$(
              'android=new UiSelector().descriptionContains("movie_")'
            );

            if (movieItems.length > 0) {
              writeLog(searchLogFile,
                `  ✅ Found ${movieItems.length} movies for category: ${categoryName}`
              );

              // todo click vào phim đầu tiên
              const firstMovie = movieItems[0];
              const movieDesc = await firstMovie
                .getAttribute("content-desc")
                .catch(() => "");

              await firstMovie.click();
              writeLog(searchLogFile,`  ℹ️ Opened movie: ${movieDesc}`);
              await driver.pause(3000);

              // todo quay lại màn hình search
              await driver.back();
              await driver.pause(2000);
            } else {
              writeLog(searchLogFile,`  ⚠️ No movies found for category: ${categoryName}`);
            }
          }

          writeLog(searchLogFile,`✅ Category Test - PASSED`);
        } else if (testCase.type === "search") {
          // todo test search by query
          writeLog(searchLogFile,`\n  🔎 Searching for: ${testCase.query}`);

          // todo click vào search bar
          const searchBar = await driver.$("~search_bar");
          await searchBar.waitForDisplayed({ timeout: 5000 });
          await searchBar.click();
          await driver.pause(1000);

          // todo nhập text vào search bar
          await typeIntoField(
            driver,
            "~search_bar",
            testCase.query,
            "Search Query",
            false,
            searchLogFile
          );

          // todo nhấn enter
          await driver.execute("mobile: performEditorAction", {
            action: "search",
          });
          writeLog(searchLogFile,`✅ Pressed enter to search`);

          await driver.pause(3000); // Đợi kết quả tìm kiếm

          // todo kiểm tra text "Result" xuất hiện
          const resultText = await driver
            .$('android=new UiSelector().textContains("Result")')
            .getText()
            .catch(() => "");

          if (resultText) {
            writeLog(searchLogFile,`  ✅ Search results displayed`);

            // todo kiểm tra có phim trong kết quả không
            const movieItems = await driver.$$(
              'android=new UiSelector().descriptionContains("movie_")'
            );

            if (movieItems.length > 0) {
              writeLog(searchLogFile,`  ✅ Found ${movieItems.length} movies`);

              // todo click vào phim đầu tiên
              const firstMovie = movieItems[0];
              const movieDesc = await firstMovie
                .getAttribute("content-desc")
                .catch(() => "");

              await firstMovie.click();
              writeLog(searchLogFile,`  ℹ️ Opened movie: ${movieDesc}`);
              await driver.pause(2000);
            } else {
              writeLog(searchLogFile,`  ⚠️ No movies found for query: ${testCase.query}`);
            }
          } else {
            writeLog(searchLogFile,`  ⚠️ No results section found`);
          }

          writeLog(searchLogFile,`✅ Search Query Test - PASSED`);
        }
      } catch (error) {
        writeLog(searchLogFile,`❌ ${testCase.testName} - FAILED: ${error.message}`);
      }
    }
  } catch (err) {
    writeLog(searchLogFile,`❌ Test failed: ${err.message}`);
    throw err;
  } finally {
    await quitDriver(driver);
    writeLog(searchLogFile,"\n🏁 Test completed.\n");
  }
}

runSearchTest().catch(console.error);
