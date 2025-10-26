
async function getErrorText(driver, selector, label) {
  try {
    const element = await driver.$(selector);
    const isVisible = await element.isDisplayed();
    if (isVisible) {
      const text = await element.getText();
      return text;
    }
  } catch (_) {
    /* không có lỗi này */
  }
  return "";
}

export { getErrorText };