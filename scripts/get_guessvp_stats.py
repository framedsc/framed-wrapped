from dotenv import load_dotenv
import discord
from discord.ext import commands
import os
import datetime

client = discord.Client(intents=discord.Intents.default(), max_messages=None)

load_dotenv()
TOKEN = os.environ.get("DISCORD_TOKEN")

intents = discord.Intents.default()
intents.members = True
bot = commands.Bot(command_prefix="!", intents=intents)

def getbotgameschannel():
    for g in bot.guilds:
        if g.name == "FRAMED - Screenshot Community":
            return discord.utils.get(g.channels, name="bot-games")

async def getLastYearMessages(year):
    sys_channel = getbotgameschannel()

    stats = {}

    async for message in sys_channel.history(limit=None, after=datetime.datetime(year, 1, 1, 0, 0, 0), before=datetime.datetime(year + 1, 1, 1, 0, 0, 0)):
        try:
            print(message.created_at.strftime("%Y-%m-%dT%H:%M:%S.%f"))
            if message.author.id == 873628046194778123 and len(message.mentions) != 0 and "found the vp!" in message.content:
                stats[str(message.mentions[0].id)] = stats.get(str(message.mentions[0].id), 0) + 1 
        except:
            print(stats)
            return
    

    print([[k, v] for k, v in stats.items()])
    return


@bot.event
async def on_ready():
  print("woke up")
  await getLastYearMessages(2025)

bot.run(TOKEN)