import { remote } from "webdriverio";

export async function createDriver() {
  const opts = {
    protocol: "http",
    hostname: "127.0.0.1",
    port: 4723,
    path: "/",
    capabilities: {
      platformName: "Android",
      "appium:deviceName": "R3CR703KX5M", // adb devices
      "appium:automationName": "UiAutomator2",
      "appium:noReset": true,
      "appium:app":
        "D:\\Cinemate\\app\\build\\outputs\\apk\\debug\\app-debug.apk",
    },
  };

  const driver = await remote(opts);
  return driver;
}

export async function quitDriver(driver) {
  if (driver) await driver.deleteSession();
}
