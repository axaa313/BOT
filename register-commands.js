const { REST, Routes } = require("discord.js");
require("dotenv").config();

const commands = [
  {
    name: "roolit",
    description: "Lähettää Prime-roolipaneelin",
  },
];

const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

(async () => {
  try {
    console.log("Rekisteröidään komento...");

    await rest.put(
      Routes.applicationGuildCommands(
        process.env.CLIENT_ID,
        process.env.GUILD_ID
      ),
      { body: commands }
    );

    console.log("Valmis!");
  } catch (error) {
    console.error(error);
  }
})();