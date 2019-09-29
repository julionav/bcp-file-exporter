const prompts = require("prompts");
const fs = require("fs");
const { encrypt, decrypt } = require("./crypto");

const SAVED_CREDS_PATH = "./.secret";

const savedCredentialsExists = () => fs.existsSync(SAVED_CREDS_PATH);

const getSavedCredentials = password =>
  JSON.parse(decrypt(fs.readFileSync(SAVED_CREDS_PATH).toString(), password));

const saveCredentials = credentials =>
  fs.writeFileSync(
    SAVED_CREDS_PATH,
    encrypt(JSON.stringify(credentials), credentials.password)
  );

const opts = {
  onCancel: () => {
    console.log("This information is required to continue.");
    return true;
  }
};

const getCardNumber = () =>
  prompts(
    {
      type: "password",
      name: "cardNumber",
      message: "Please input your card number",
      validate: value => value.length === 16 || `Card number must has 16 digits`
    },
    opts
  );

const getPassword = () =>
  prompts(
    {
      type: "password",
      name: "password",
      message: "Please input your password",
      validate: value => value.length === 6 || "Password must have 6 digits"
    },
    opts
  );

const promptIfUseSavedCreds = () =>
  prompts(
    {
      type: "confirm",
      name: "useSavedCreds",
      message: "Do you want to use the credentials that are secretly stored?",
      validate: value => value.length === 6 || "Password must have 6 digits"
    },
    opts
  );

const promptIfSaveCreds = () =>
  prompts(
    {
      type: "confirm",
      name: "shouldSavedCreds",
      message:
        "Do you want to store (encrypted) this credentials to use later?",
      validate: value => value.length === 6 || "Password must have 6 digits"
    },
    opts
  );

const getCredentials = async () => {
  if (savedCredentialsExists()) {
    const { useSavedCreds } = await promptIfUseSavedCreds();
    if (useSavedCreds) {
      const { password } = await getPassword();
      return getSavedCredentials(password);
    }
  }

  const { cardNumber } = await getCardNumber();
  const { password } = await getPassword();
  if (!cardNumber || !password)
    throw new Error("BCP data cannot be exported without credentials");

  const { shouldSavedCreds } = await promptIfSaveCreds();
  const credentials = { cardNumber, password };

  console.log({ shouldSavedCreds });

  if (shouldSavedCreds) saveCredentials(credentials);

  return credentials;
};

module.exports = getCredentials;
