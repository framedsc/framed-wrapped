from tinydb import TinyDB, Query
from dotenv import load_dotenv
import discord
from discord.ext import commands
import os
import datetime

from tqdm.asyncio import tqdm

client = discord.Client(intents=discord.Intents.default(), max_messages=None)

load_dotenv()
TOKEN = os.environ.get("DISCORD_TOKEN")
sysdb = TinyDB("sysdb.json", indent=2)

intents = discord.Intents.default()
intents.members = True
bot = commands.Bot(command_prefix="!", intents=intents)

def getsyschannel():
    for g in bot.guilds:
        if g.name == "FRAMED - Screenshot Community":
            return discord.utils.get(g.channels, name="share-your-shot")

async def getLastYearMessages(year):
    sys_channel = getsyschannel()
    # print(datetime.datetime(2022, 1, 1, 0, 0, 0))
    # messages = [message async for message in channel.history(limit=None, after=datetime.datetime(2022, 1, 1, 0, 0, 0))]

    sys_list = []
    
    # sys_messages = sys_channel.history(limit=20, after=datetime.datetime(year, 1, 1, 0, 0, 0))

    #pbar = tqdm(desc="Processing", unit=" items", position=0, leave=True)
    
    # async for message in sys_channel.history(limit=20, after=datetime.datetime(year, 1, 1, 0, 0, 0)):
    async for message in sys_channel.history(limit=None, after=datetime.datetime(year, 1, 1, 0, 0, 0), before=datetime.datetime(year + 1, 1, 1, 0, 0, 0)):
      if len(message.attachments) == 0:
          continue

      if len(sysdb.search(Query().message_id == message.id)) > 0:
          continue

      gamename = await getgamename(message)
      entry = await getEntry(message, gamename, sys_list)
      # print(entry)
      sys_list.append(entry)

      print(message.created_at.strftime("%Y-%m-%dT%H:%M:%S.%f"))

      sysdb.insert(entry)
      #pbar.update(1)

    #pbar.close()
      
    # sysdb.insert_multiple(sys_list)
    sysdb.all()
    print("Done!")


async def uniqueUsersReactions(message):
    uniqueUsers = []
    if message.reactions == []:
        return uniqueUsers
    for reaction in message.reactions:
        if reaction.users() == []:
            return uniqueUsers
        async for user in reaction.users():
            uniqueUsers.append(user)

    uniqueUsers = list(
        filter(lambda u: u.id != message.author.id, dict.fromkeys(uniqueUsers))
    )  # deleting duplicates and not letting the author counts in the number of unique reactions
    return uniqueUsers

async def getEntry(message, gamename, sys_list):
    elementid = len(sys_list) + 1
    score = await uniqueUsersReactions(message)
    score = len(list(score))
    entry = {
            "gameName": gamename,
            "height": message.attachments[0].height,
            "width": message.attachments[0].width,
            "author": str(message.author.id),
            "date": message.created_at.strftime("%Y-%m-%dT%H:%M:%S.%f"),
            "score": score,
            "ID": elementid,
            "epochTime": int(message.created_at.timestamp()),
            "spoiler": message.attachments[0].is_spoiler(),
            "message_id": message.id,
    }
    return entry

def timedifabs(d1, d2):
    if d1 - d2 < datetime.timedelta(days=0):
        return d2 - d1
    return d1 - d2

# Checks five messages before and after the message to see if it finds a text to use as name of the game
async def getgamename(message):
    gamename = message.content  # message.content

    if gamename and len(gamename) < 255:
        # Please dont judge me its late and I am tired
        if "\n" in gamename:
            return gamename.split("\n", 1)[0]
        else:
            return gamename

    sys_channel = getsyschannel()

    messages = sys_channel.history(
        around=message.created_at, oldest_first=True, limit=12
    )
    listmessages = messages
    # listmessages = list(listmessages)

    # listmessages = list(filter(lambda m: m.content and len(m.content)<255 and (m.author==message.author), listmessages))
    listmessages = [
        m
        async for m in listmessages
        if m.content and len(m.content) < 255 and (m.author == message.author)
    ]

    if not listmessages:
        return ""

    placeholdermessage = listmessages[0]  # it never fails because of the previous if
    for m in listmessages:
        if timedifabs(placeholdermessage.created_at, message.created_at) > timedifabs(
            m.created_at, message.created_at
        ):
            placeholdermessage = m

    # print(placeholdermessage.content)

    # Please dont judge me its late and I am tired
    if "\n" in placeholdermessage.content:
        return placeholdermessage.content.split("\n", 1)[0]
    else:
        return placeholdermessage.content
    
@bot.event
async def on_ready():
  print("woke up")
  await getLastYearMessages(2025)

bot.run(TOKEN)