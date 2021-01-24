const { openBrowser, goto, closeBrowser } = require("taiko");
const login = require("./commands/login");
const { getAccountNames, exportAccountsMovements } = require("./commands/account");
const getCredentials = require("./lib/credentials");

const start = async () => {
  try {
    const { cardNumber, password } = await getCredentials();

    await openBrowser({ headless: false });
    await goto("https://bcpzonasegurabeta.viabcp.com/#/iniciar-sesion");

    await login(cardNumber, password);

    await exportAccountsMovements()

  } catch (e) {
    console.error(e);
  } finally {
    //await closeBrowser();
  }
};

start();
