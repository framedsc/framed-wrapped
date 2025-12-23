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
  ['764427456856981544', 432],
  ['80738520422944768', 1061],
  ['188691759470084097', 71],
  ['163919378285461504', 517],
  ['576442964163690527', 63],
  ['727947925535195137', 21],
  ['142170955630772225', 630],
  ['349272662901522444', 5],
  ['770718209913389096', 23],
  ['446743605529280522', 258],
  ['432838731376885762', 6],
  ['433917542906724352', 29],
  ['803292692251017313', 1],
  ['242345941317713920', 4],
  ['287893831976747009', 3],
  ['192300712049246208', 6],
  ['128245457141891072', 14],
  ['960401306479128636', 15],
  ['797413306032848896', 15],
  ['267828878934802453', 3],
  ['480092672330170368', 40],
  ['252982786024144907', 2],
  ['415478928833118260', 2],
  ['365583928003788800', 1],
  ['1110154144662159450', 2],
  ['220206083136946176', 10],
  ['379860789340798976', 2],
  ['381155529814179840', 5],
  ['197446843972452352', 1],
  ['173567676772384768', 1],
  ['261540616238923777', 1]
];

const Home = () => {
  return WrapYear(year, flavourText, guessTheVPData);
};

export default Home;
