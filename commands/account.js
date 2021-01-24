const { evaluate, image, click, $, above } = require("taiko");

const getAccountNames = () =>
  evaluate(() =>
    Array.from(document.querySelectorAll(".icon-toggle-right .ng-binding")).map(
      node => node.textContent
    )
  );

const exportAccountMovements = async accountName => {
  await evaluate(() =>
    Array.from(document.querySelectorAll(".icon-toggle-right .ng-binding"))
      .find(node => node.textContent === accountName)
      .click()
  );
  await click("VER MOVIMIENTOS");
  await click("Exportar");
};

const exportAccountsMovements = async () => {
  const accounts = (await getAccountNames()).result;
  for (let account of accounts) {
    await exportAccountMovements(account);
    await click(image("Banco de Crédito"));
  }
};

module.exports = {
  getAccountNames,
  exportAccountsMovements
};
