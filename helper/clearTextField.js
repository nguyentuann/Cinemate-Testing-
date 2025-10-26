export async function clearTextField(driver, element, maxChars = 20) {

  for (let i = 0; i < maxChars; i++) {
    await driver.pressKeyCode(67);
  }
  await driver.pause(300);
}