import fs from "fs";
import { createDriver, quitDriver } from "../config/driver.js";
import { videoPlayerTestCases } from "../data/videoPlayerData.js";
import { writeLog } from "../helper/writeLog.js";
import { logFile } from "../constant/path_file.js";

// --- main test ---
async function runVideoPlayerTest() {
  const driver = await createDriver();

  if (fs.existsSync(logFile)) fs.writeFileSync(logFile, "", "utf-8");

  try {
    writeLog(`\n🎬 Starting Video Player Controls Test`);

    // todo điều hướng đến video player (giả sử từ màn hình detail hoặc danh sách phim)
    const homePlayButton = await driver.$("~home_play_button");
    await homePlayButton.waitForDisplayed({ timeout: 5000 });
    await homePlayButton.waitForEnabled({ timeout: 5000 });
    await homePlayButton.click();
    writeLog(`📱 Opening video player...`);
    await driver.pause(5000); // Đợi video player load

    for (const testCase of videoPlayerTestCases) {
      writeLog(`\n🧪 Test: ${testCase.testName} - ${testCase.description}`);

      try {
        for (const action of testCase.actions) {
          switch (action) {
            case "pause":
              const pauseButton = await driver.$("~play_pause_button");
              await pauseButton.waitForDisplayed({ timeout: 5000 });
              await pauseButton.click();
              writeLog(`⏸️ Pause button clicked`);
              await driver.pause(1000);
              break;

            case "play":
              const playButton = await driver.$("~play_pause_button");
              await playButton.waitForDisplayed({ timeout: 5000 });
              await playButton.click();
              writeLog(`▶️ Play button clicked`);
              await driver.pause(1000);
              break;

            case "forward":
              const forwardButton = await driver.$("~forward_10_button");
              await forwardButton.waitForDisplayed({ timeout: 5000 });
              await forwardButton.click();
              writeLog(`⏩ Forward 10s button clicked`);
              await driver.pause(1000);
              break;

            case "backward":
              const backwardButton = await driver.$("~backward_10_button");
              await backwardButton.waitForDisplayed({ timeout: 5000 });
              await backwardButton.click();
              writeLog(`⏪ Backward 10s button clicked`);
              await driver.pause(1000);
              break;

            case "quality":
              const qualityButton = await driver.$("~quality_button");
              await qualityButton.waitForDisplayed({ timeout: 5000 });
              await qualityButton.click();
              writeLog(`🎞️ Quality menu opened`);
              await driver.pause(1000);

              // Test từng quality option
              for (const quality of testCase.qualities) {
                const qualityOption = await driver.$(
                  `~${quality}_quality_option`
                );
                const isDisplayed = await qualityOption
                  .isDisplayed()
                  .catch(() => false);

                if (isDisplayed) {
                  await qualityOption.click();
                  writeLog(`   ✅ Selected quality: ${quality}`);
                  await driver.pause(2000);

                  // Mở lại menu để test quality khác
                  if (
                    quality !==
                    testCase.qualities[testCase.qualities.length - 1]
                  ) {
                    await qualityButton.click();
                    await driver.pause(1000);
                  }
                }
              }
              break;

            case "speed":
              const speedButton = await driver.$("~speed_button");
              await speedButton.waitForDisplayed({ timeout: 5000 });

              // Click nhiều lần để test các speed khác nhau
              for (let i = 0; i < 4; i++) {
                await speedButton.click();
                const speedText = await speedButton.getText();
                writeLog(`⚡ Speed changed to: ${speedText}`);
                await driver.pause(1000);
              }
              break;

            case "silent":
              const silentButton = await driver.$("~silent_button");
              await silentButton.waitForDisplayed({ timeout: 5000 });

              // Toggle silent
              await silentButton.click();
              writeLog(`🔇 Toggled to mute`);
              await driver.pause(1000);

              await silentButton.click();
              writeLog(`🔊 Toggled to unmute`);
              await driver.pause(1000);
              break;

            case "lock":
              // Tìm button lock (nút cuối cùng trong row controls)
              const lockButton = await driver.$("~lock_button");
              await lockButton.waitForDisplayed({ timeout: 5000 });
              await lockButton.click();
              writeLog(`🔒 Controls locked`);
              await driver.pause(2000);
              break;

            case "unlock":
              // Click unlock button ở center màn hình
              const unlockButton = await driver.$("~unlock_button");
              await unlockButton.waitForDisplayed({ timeout: 5000 });
              await unlockButton.click();
              writeLog(`🔓 Controls unlocked`);
              await driver.pause(1000);
              break;

            case "close":
              const closeButton = await driver.$("~close_video_button");
              await closeButton.waitForDisplayed({ timeout: 5000 });
              await closeButton.click();
              writeLog(`❌ Close button clicked`);
              await driver.pause(2000);

              // Test đã quay lại màn hình trước chưa
              const isPlayerGone = !(await driver
                .$("~play_pause_button")
                .isDisplayed()
                .catch(() => false));
              if (isPlayerGone) {
                writeLog(`✅ Video player closed successfully`);
              }
              return; // Thoát test sau khi đóng video
          }
        }

        writeLog(`✅ ${testCase.testName} - PASSED`);
      } catch (error) {
        writeLog(`❌ ${testCase.testName} - FAILED: ${error.message}`);
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

runVideoPlayerTest().catch(console.error);
