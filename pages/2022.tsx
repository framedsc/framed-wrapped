import WrapYear from "./_year-data";

const year: number = 2022;

const flavourText = {
  intro: [`We wanted to take a moment to reflect on some of the most stunning
  virtual photography and video game screenshots that the Framed community has produced throughout 2022.`,
  `From breathtaking landscapes in open-world games to intense action shots in first-person shooters,
  our community has truly outdone itself in capturing the beauty and emotion of these digital worlds.
  Join us as we look back at some of the most memorable moments and incredible imagery of the past year.
  `],
  top10sys: [`As we wrap up 2022, it's time to take a look back at the most captivating shots of
  the year in Framed's Share Your Shot Discord channel. Unsurprisingly Cyberpunk 2077 dominated
  the top spot with an astounding 1518 shots making up 8.78% of the total shots posted throughout the year.
  Elden Ring’s impressive and illusive vistas saw some love this year with 1070 shots no doubt capturing
  equal parts frustration and wanderlust. The third spot represents the talent and detail often
  overlooked in most racing games, with Assetto Corse doing the genre proud at a humble 532 total shots posted.
  `],
  top10hof: [`Each shot submitted has a chance to make it to the Hall of Framed -
  our curated collection of shots voted for by the Framed community.
  We saw some familiar titles hold their position at the top, from Cyberpunk 2077’s neon cityscapes to
  the rolling plains of Red Dead Redemption 2. 2022 also saw a few newer titles breaking through to claim
  their spot in the top 10 games, like Elden Ring with 94 shots and Stray at 35 entries making it into the HOF.
  `],
  busysys: [`February 1st 2022 saw an impressive 89 total shots shared by the community into Share Your Shot,
  with God of War wrestling the top spot with 19 total shots posted in a single day.
  Staple titles like Red Dead Redemption 2 and Cyberpunk 2077 saw some regular attention too,
  with honorable mentions to car demolition sandbox game BeamNG.Drive seeing some love too.
  `],
  busyhof: [`It should come as no surprise that the busiest day for the Hall of Framed in 2022
  features some of our most familiar and favorite titles. Red Dead Redemption 2 etched out the top spot
  with four different shots gaining enough votes to break into the curated gallery,
  followed quickly by server-mainstay title Cyberpunk 2077.Perhaps the most unusual entry into this
  list however comes from Planet Zoo with community member Roman exploring some delightful animal
  portraits in the zoo tycoon title.
  `],
}

const guessTheVPData = [
  ['436184814379466752', 581],
  ['261041102562394113', 8],
  ['173567676772384768', 467],
  ['501389636908744704', 108],
  ['228225094013419521', 16],
  ['192300712049246208', 104],
  ['368634352550150144', 33],
  ['708833719271817226', 18],
  ['102853607354806272', 45],
  ['301881785426378762', 59],
  ['158655628531859456', 6],
  ['446743605529280522', 935],
  ['265908457784213505', 85],
  ['163919378285461504', 1012],
  ['364473042111561730', 40],
  ['128245457141891072', 33],
  ['261540616238923777', 32],
  ['232028125641441282', 3],
  ['310528138067181572', 3],
  ['576442964163690527', 91],
  ['267828878934802453', 45],
  ['220206083136946176', 25],
  ['101175716963426304', 1],
  ['284507323320369164', 26],
  ['389436059991146507', 7],
  ['803292692251017313', 12],
  ['463025285554634753', 47],
  ['381509831464321034', 7],
  ['296727915104829452', 2],
  ['588031215714566148', 11],
  ['139003396081451008', 1],
  ['228710649415467009', 4],
  ['369578900675624982', 1],
  ['174458099569131520', 2],
  ['432838731376885762', 7],
  ['381155529814179840', 36],
  ['89971966106148864', 154],
  ['199138165548777472', 16],
  ['144351873086914560', 4],
  ['415478928833118260', 106],
  ['208505645983334402', 2],
  ['540875144277786624', 2],
  ['405292470004482058', 5],
  ['460424209491820555', 20],
  ['381890194934333450', 6],
  ['393606061069959168', 7],
  ['484375157687844884', 7],
  ['928573423054106644', 66],
  ['764427456856981544', 4],
  ['229243430667026432', 14],
  ['576105888771866644', 2],
  ['960401306479128636', 18],
  ['235148962103951360', 4],
  ['320237189986385920', 60],
  ['197074875951611905', 1],
  ['172832590817001472', 2]
]

const Home = () => {
  return WrapYear(year, flavourText, guessTheVPData);
};

export default Home;
