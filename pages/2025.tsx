import WrapYear from "./_year-data";

const year: number = 2025;

const flavourText = {
  intro: [`It's yet another year gone, and another fantastic collection of screenshots have been captured
    by our amazing community members to crystalise what everyone was playing in 2025. While the world
    gets a little crazier by the day, we hope that members and passing visitors alike will enjoy our
    yearly roundup of what our fantastic community were up to this year, and for the statistics lovers out there,
    there’s plenty of numbers to paw through as we take a trip back through the highs and lows of 2025.`,
],
  top10sys: [`Cyberpunk 2077 remains the single most-shot game of 2025, holding its position year over year
    since coming out and continuing to provide a never-ending stream of neon glory. However,
    the distribution across the rest of the top ten appears more evenly spread than in previous years,
    with several games carving out a respectable position in the top ten like Expedition 33, Kingdom Come 2,
    and even Infinity Nikki, because who doesn’t love playing dress up in our favorite games?
`],
  top10hof: [`Cyberpunk 2077 continues to hold a firm grip on its lead year over year,
    once again claiming the top spot in the Hall of FRAMED for 2025 with no signs of slowing down.
    We do however see a bit of a shakeup with games like Kingdom Come 2 and Expedition 33 charging ahead to dethrone
    mainstay favorites like Red Dead Redemption 2 and Elden Ring. Perhaps the most notable omission from 2025
    being the lack of any Baldur’s Gate 3 presence in the Hall of FRAMED top ten. Astarion would be so disappointed.
`],
  busysys: [`Perhaps the most surprising title to appear on 2025’s recap, Star Wars Outlaws made a splash within
    the community on our busiest day in the Share Your Shot bullpen. With June 11th marking our highest single day traffic,
    the polarizing space adventure took an almost 10% chunk of that for itself, with other popular titles like Ghost of Tsushima,
    Expedition 33, and Lies of P hot on its heels. Not even the release of Stellar Blade or
    the Switch 2 days earlier could slow down the passion of our ever wandering members.
`],
  busyhof: [`June was a busy month for the Hall of FRAMED too, with June 16th seeing the busiest day for entries
    winning a spot inside the coveted halls of the gallery. Leading the charge on this hectic day was DontNod’s
    spinoff Lost Records: Bloom and Rage, with a 16% lead over all shots finding a place that day, and leaving
    Expedition 33 only slightly trailing behind with its 14% share of entries. Perhaps the most notable thing about 2025’s
    roundup is just how even the spread of the top ten is this year, with an almost even distribution throughout
    the most popular titles, we may be witnessing a slow dethroning of past year’s frontrunners.
`],
}

const guessTheVPData = [['142170955630772225', 37],
  ['576442964163690527', 16],
  ['80738520422944768', 77],
  ['770718209913389096', 11],
  ['609843077233901599', 32],
  ['764427456856981544', 15],
  ['349272662901522444', 15],
  ['173567676772384768', 1],
  ['727947925535195137', 2],
  ['128245457141891072', 2],
  ['66196453084626944', 1],
  ['415478928833118260', 1],
  ['188691759470084097', 1],
  ['489832819040845824', 21],
  ['1056582870958870619', 9],
  ['267828878934802453', 1],
  ['163919378285461504', 4],
  ['660089475678076998', 1],
  ['446743605529280522', 3],
  ['287893831976747009', 9]
];

const Home = () => {
  return WrapYear(year, flavourText, guessTheVPData);
};

export default Home;
