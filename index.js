const { openBrowser, goto, closeBrowser } = require("taiko");
const { login } = require("./commands");

const start = async () => {
  try {
    await openBrowser({ headless: false });
    await goto("https://bcpzonasegurabeta.viabcp.com/#/iniciar-sesion");

    await login("", "");
  } catch (e) {
    console.error(e);
  } finally {
    await closeBrowser();
  }
};

start();
