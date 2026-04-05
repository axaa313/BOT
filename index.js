const {
  Client,
  GatewayIntentBits,
  Events,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
} = require("discord.js");
require("dotenv").config();

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers],
});

function panel() {
  const embed = new EmbedBuilder()
    .setTitle("🔔 Prime Roolit")
    .setDescription("Valitse mitä haluat saada.")
    .setColor("#8B5CF6")
    .addFields(
      { name: "Päivitykset 🔔", value: "Serverin päivitykset" },
      { name: "Arvonta", value: "Osallistu arvontoihin" },
      { name: "Airdrop", value: "Airdrop-ilmoitukset" }
    );

  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId("updates")
      .setLabel("Päivitykset 🔔")
      .setStyle(ButtonStyle.Primary),

    new ButtonBuilder()
      .setCustomId("arvonta")
      .setLabel("Arvonta")
      .setStyle(ButtonStyle.Primary),

    new ButtonBuilder()
      .setCustomId("airdrop")
      .setLabel("Airdrop")
      .setStyle(ButtonStyle.Primary)
  );

  return { embeds: [embed], components: [row] };
}

client.once(Events.ClientReady, () => {
  console.log("Prime bot valmis 🔥");
});

// Auto role
client.on(Events.GuildMemberAdd, async (member) => {
  try {
    const role = member.guild.roles.cache.get(process.env.AUTO_ROLE_ID);
    if (role) {
      await member.roles.add(role);
    }
  } catch (error) {
    console.error("Virhe auto-rolessa:", error);
  }
});

// Slash-komento + napit
client.on(Events.InteractionCreate, async (interaction) => {
  try {
    if (interaction.isChatInputCommand()) {
      if (interaction.commandName === "roolit") {
        await interaction.reply({
          content: "Paneeli lähetetty!",
          ephemeral: true,
        });

        await interaction.channel.send(panel());
      }
      return;
    }

    if (!interaction.isButton()) return;

    let roleId;

    if (interaction.customId === "updates") {
      roleId = process.env.UPDATES_ROLE_ID;
    } else if (interaction.customId === "arvonta") {
      roleId = process.env.ARVONTA_ROLE_ID;
    } else if (interaction.customId === "airdrop") {
      roleId = process.env.AIRDROP_ROLE_ID;
    } else {
      return;
    }

    const role = interaction.guild.roles.cache.get(roleId);
    if (!role) {
      await interaction.reply({
        content: "Roolia ei löytynyt.",
        ephemeral: true,
      });
      return;
    }

    const member = interaction.member;

    if (member.roles.cache.has(role.id)) {
      await member.roles.remove(role);
      await interaction.reply({
        content: `Poistettiin ${role.name}`,
        ephemeral: true,
      });
    } else {
      await member.roles.add(role);
      await interaction.reply({
        content: `Lisättiin ${role.name}`,
        ephemeral: true,
      });
    }
  } catch (error) {
    console.error("Virhe interactionissa:", error);

    if (interaction.isRepliable() && !interaction.replied && !interaction.deferred) {
      await interaction.reply({
        content: "Tuli virhe toimintoa käsitellessä.",
        ephemeral: true,
      });
    }
  }
});

client.login(process.env.TOKEN);