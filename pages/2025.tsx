import WrapYear from "./_year-data";

const year: number = 2025;

const flavourText = {
  intro: [`Another year has come and gone, and with it brought a whole host of new games to shoot
    and old favorites to revisit. From new entries into existing sagas to DLC bringing us back to
    the familiar lands of once-traveled adventures, we’ve been spoiled by the release roster of 2024,
    and as a result, our Discord server has had no end of titles to flex those creative muscles in.`,

    `We’ve put our Discord Server bots to work, and come up with the end-of-year results to showcase how 2024 unfolded.
    With over 17,000 shots posted to the server in the last 12 months, and with over 1,000 of those making it
    into the prestigious Hall of Framed over that time, our members have been making the most of 2024’s bounty of releases.
    If you’d like to see what Framed got up to in previous years, check out the wrap-up sections below, but for now,
    let’s get into finer details for 2024.`
],
  top10sys: [`2024 saw Cyberpunk 2077 continue strong as the most posted title in Share Your Shot
    with a whopping 10% of all shots posted being bathed in Night Ctiy’s neon lights.
    Elden Ring also saw a strong return this year at 5% of all shots, no doubt helped by
    the stunning new vistas of the Shadow of the Erdtree DLC bringing people back to
    the game for another run. The newest contender to the mix, Dragon Age: The Veilguard managed to
    sneak in at the end of the year with our members enjoying the creative freedom of its subjects' models,
    with a whole host of stunning portrait shots coming out of the fantasy adventure game.
`],
  top10hof: [`It should come as no surprise then that with Cyberpunk 2077 dominating Share Your Shot,
    the dystopian cityscape would also dominate the curated gallery that is the Hall of Framed.
    Making up 15% of all shots entered into the Hall of Framed in 2024,
    CD Projekt Red’s title continues to show off everything it has to offer,
    and the modding scene continues to help folks express their creative muscles in exciting ways.
    Following swiftly behind is server favorite Red Dead Redemption 2, which remains popular among
    the voters in Share Your Shot, no doubt due to the stunning views and breathtaking details that
    even now continue to be found and framed by those still exploring the 2018 Western.
    Some other popular titles continue to hold their space within the top ten too in 2024,
    including Baldur’s Gate 3, Hogwarts Legacy, and Alan Wake 2, all finding popularity in 2023
    only to carry that success into this year too.
`],
  busysys: [`After having recently released a few weeks prior, the revisit to Guerilla’s neo-jurassic
    adventure Horizon Forbidden West was crowned the hottest game to shoot on our busiest day - April 2nd.
    The bow-wielding heroine saw 25 shots land into the Discord server on this day,
    blasting all other games out of the way as it claimed over 25% of the day’s activity alone.
    Dragon's Dogma 2, also releasing a few weeks prior, made an appearance as the second most posted title with 11 shots,
    as the server was understandably still trying to figure out why they should be afraid of Dragonsplague.
    The most active day in Share Your Shot also saw the appearance of some unusual lesser-seen titles sneaking in,
    including Hot Pursuit Remastered and Daymare:1998.
`],
  busyhof: [`While Cyberpunk may dominate the overall popularity contest within the Hall of Framed,
    surprisingly it was the narrative adventure title Indika that saw itself crowned as the game with
    the most entries into the Hall of Framed with an impressive 9 shots landing into the gallery all at once.
    Server favorite Red Dead Redemption 2 saw itself getting some love from the server too,
    along with Sucker Punch’s Samurai sneak-em-up Ghost of Tsushima,
    both with 7 shots each landing a spot in the gallery at the same time.
`],
}

const guessTheVPData = [
['142170955630772225', 26],
['576442964163690527', 14],
['80738520422944768', 61],
['770718209913389096', 11],
['609843077233901599', 32],
['764427456856981544', 15],
['349272662901522444', 13],
['173567676772384768', 1],
['727947925535195137', 2],
['128245457141891072', 2],
['66196453084626944', 1],
['415478928833118260', 1],
['188691759470084097', 1],
['489832819040845824', 7],
['1056582870958870619', 9],
['267828878934802453', 1],
['163919378285461504', 2]
];

const Home = () => {
  return WrapYear(year, flavourText, guessTheVPData);
};

export default Home;
