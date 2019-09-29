const { write, click, $, evaluate, waitFor, button } = require("taiko");
const { identifyDigits } = require("../lib/image-recognition");
const svgToImage = require("../lib/svgToImage");

const typeCardNumber = async cardNumber => {
  const inputSelector = $("#cardnumberA");
  await click(inputSelector);
  await write(cardNumber, inputSelector);
};

const getImageUrls = () => {
  let id = 0;
  const createID = () => `digit-${id++}`;
  const digitNodes = Array.from(
    document.querySelectorAll(
      ".visible-inline-lg .keypad-numbers .keypad-digit:not(.mrn) img"
    )
  );

  return digitNodes.map(digit => {
    digit.id = createID();
    return {
      id: digit.id,
      svg: digit.src
    };
  });
};

const typePassword = async password => {
  const digitsWithSVGs = (await evaluate(getImageUrls)).result;

  const digitImages = await Promise.all(
    digitsWithSVGs.map(({ svg }) => svg).map(svgToImage)
  );
  const digitsWithTextValue = await identifyDigits(digitImages);

  const digitsResult = digitsWithTextValue.map((text, index) => ({
    id: digitsWithSVGs[index].id,
    text: text
  }));

  const digitsInOrder = password
    .split("")
    .map(passwordDigit => digitsResult.find(r => r.text === passwordDigit));

  // Clicking digits in order
  for (let digit of digitsInOrder) {
    await click($(`#${digit.id}`));
  }
};

const clickIfExists = selector => {
  if (selector.exists()) return click(selector);
};

const maybeCloseOtherSessions = () =>
  clickIfExists(button("CERRAR OTRAS SESIONES ABIERTAS"));

const waitForCaptcha = (time = 30000) =>
  waitFor(async () => {
    const isButtonDisabled = await evaluate(button("Ingresar"), el =>
      el.getAttribute("disabled")
    );
    return !isButtonDisabled.result;
  }, time);

const submitLoginForm = () => click(button("Ingresar"));

const login = async (cardNumber, password) => {
  await Promise.all([typeCardNumber(cardNumber), typePassword(password)]);

  await waitForCaptcha();
  await submitLoginForm();

  // Some times another session is open and it must be closed
  await maybeCloseOtherSessions();
};

module.exports = login;
