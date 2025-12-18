import { IShot } from "@types";
import React, { useRef, useEffect, useState, RefObject } from "react";
import Head from "next/head";
import { CalendarTooltipProps } from "@nivo/calendar";
import { calendarDataFormat, gameDistPie } from "@util";
import { Calendar, Pie } from "@components/charts";
import { Container, LoadWrapper, Modal } from "@components/global";
import {
  ErrorNoData,
  ErrorSection,
  LoadingSection,
} from "@components/experience-fragments";
import { LeaderboardEntry } from "@components/year-data/guess-the-vp-leadboard";
import Leaderboard from "@components/year-data/guess-the-vp-leadboard";
import CSS from 'csstype';
import { basePath } from '../next.config';

import { getHofAuthors, getHofImages, getSysImages } from './api/request';
import { addProperties, normalizeData } from '../util/utils';

interface CalendarPieTooltip extends CalendarTooltipProps {
  data: {
    shots: IShot[];
  };
}

const CustomTooltip = (data: CalendarTooltipProps) => {
  return (
    <div className="bg-framed-black text-framed-white py-1 px-3 rounded-md shadow-md">
      {new Date(data.day).toLocaleDateString("en-US", {
        timeZone: "UTC",
        day: "2-digit",
        month: "long",
        year: "numeric",
      })}
      : <strong>{data.value}</strong>
    </div>
  );
};

const ModalContent = ({ data }: { data: CalendarTooltipProps }) => {
  if (!('data' in data)){
    return null;
  }

  return (
    <div className="bg-framed-black text-framed-white py-1 px-3 rounded-md h-96 aspect-video">
      {new Date(data.day).toLocaleDateString("en-US", {
        timeZone: "UTC",
        day: "2-digit",
        month: "long",
        year: "numeric",
      })}
      : <strong>{data.value}</strong>
      <Pie
        data={gameDistPie((data as CalendarPieTooltip).data.shots, 11)}
        tooltip={(d) => (
          <div className="bg-framed-black text-framed-white py-1 px-3 rounded-md shadow-md">
            {d.datum.label}: <strong>{d.datum.value}</strong> shots
          </div>
        )}
      />
    </div>
  );
};

const insertFlavourText = (text: any[]) => {
  const paragraphs = text.map((paragraph, index) => <> <p> {paragraph} </p> {index !== text.length -1 && text.length !== 1 ? <br /> : null } </>);
  return (
    <>
      {paragraphs}
    </>
  );
};

export default function WrapYear(year: number, flavourText: { intro: any; top10sys: any; top10hof: any; busysys: any; busyhof: any;}, guessTheVPData: any[]) {
  const getHOFUrl = (item: {gameName: any; epochTime: any; }) => {
    return `https://framedsc.com/HallOfFramed/?title=${item.gameName}&after=${year}-01-01&before=${year+1}-01-01&imageId=${item.epochTime}`
  }

  const [visible, setVisible] = useState(false);
  const [calendarDatum, setCalendarDatum] = useState<CalendarTooltipProps>();
  const [data, setData] = useState({sys: new Array<IShot>(), hof: new Array<IShot>(), authors: new Array<object>()});
  const [initialized, setInitialized] = useState(false);

  const getData = async () => {
    const imagesResponse = await getHofImages();
    const authorsResponse = await getHofAuthors();
    const sysResponse = await getSysImages(year);
    const normalizedSysImages = normalizeData(sysResponse.data);
    const systImagesList = Object.values(normalizedSysImages[0]) as IShot[];
    // drop the _default entry
    systImagesList.pop();
    const normalizedImages = normalizeData(imagesResponse.data._default);
    const normalizedAuthors = normalizeData(authorsResponse.data._default);
    const formattedImages = addProperties(normalizedImages, normalizedAuthors);

    const startofyear: number = new Date(year, 0, 1).getTime() / 1000;
    const endofyear: number = new Date(year + 1, 0, 1).getTime() / 1000;

    const yearImages = formattedImages.filter((item: { epochTime: number; }) => item.epochTime > startofyear && item.epochTime < endofyear);

    setData({ sys: systImagesList, hof: yearImages, authors: normalizedAuthors});
  };

  useEffect(() => {
    if (!initialized) {
      setInitialized(true);
      // you can't have an async useEffect, so usually people create an async function and call it right after
      const getDataAsync = async () => {
        // awaiting for getData to finish
        await getData();
      }
      getDataAsync();
    }
  }, [initialized, getData]);

  const dataAvailable = data.hof.length > 0 && data.authors.length > 0;

  var segments: {
    [key: string]: RefObject<HTMLDivElement>;
  } = {
    "Top 10 Games in Share Your Shot": useRef<HTMLDivElement>(null),
    "Top 10 Games in the Hall of Framed": useRef<HTMLDivElement>(null),
    "Most Active Day in Share Your Shot": useRef<HTMLDivElement>(null),
    "Most Active Day in the Hall of Framed": useRef<HTMLDivElement>(null),
    "Top 3 Shots of the Year": useRef<HTMLDivElement>(null),
    "Daily Share Your Shot": useRef<HTMLDivElement>(null),
    "Daily Hall of Framed": useRef<HTMLDivElement>(null),
    "Guess the VP yearly leadboard": useRef<HTMLDivElement>(null),
  };

  data.hof.forEach(item => item as IShot);
  data.sys.forEach(item => item as IShot);

  //console.log("hof entries", data.hof.length);
  //console.log("hof game entries", new Set(data.hof.map(entry => entry.gameName)).size);

  if (!dataAvailable) {
    return <LoadingSection />;
  }

  /*
  if (error) {
    return <ErrorSection message={error.message} />;
  }
  */

  if (!data) {
    return <ErrorNoData />;
  }

  const grid: IShot[] = Array.from(Array(9).keys()).map(() => {
    const randIdx = Math.floor(Math.random() * data.hof.length - 1);
    return data.hof[randIdx];
  });

  const categoriesImages: IShot[] = Array.from(Array(3).keys()).map(() => {
    const randIdx = Math.floor(Math.random() * data.hof.length - 1);
    return data.hof[randIdx];
  });

  const top10sys = gameDistPie(data.sys, 11)
    .map((item) => {
      // get shots from this game
      const shotsFromGame = data.hof.filter(
        (shot) => shot.gameName === item.label,
      );
      const randIdx = Math.floor(Math.random() * shotsFromGame.length - 1);
      // pick random shot for game
      return { ...shotsFromGame[randIdx], ...item };
    })
    .filter((item) => !!item.thumbnailUrl);

  const mostActiveSys = gameDistPie(
    calendarDataFormat(data.sys).sort((a, b) => b.value - a.value)[0].shots,
    11,
  ).map((item) => {
    const gameList = data.hof.filter(
      (shot) => shot.gameName === item.label && !!shot.thumbnailUrl,
    );
    const randIdx = Math.floor(Math.random() * gameList.length - 1);
    if (!gameList[randIdx]) {
      return { ...gameList[0], ...item };
    }
    return { ...gameList[randIdx], ...item };
  })
  .filter((item) => !!item.thumbnailUrl);

  const mostActiveHof = gameDistPie(
    calendarDataFormat(data.hof).sort((a, b) => b.value - a.value)[0].shots,
    11,
  ).map((item) => {
    const gameList = data.hof.filter(
      (shot) => shot.gameName === item.label && !!shot.thumbnailUrl,
    );
    const randIdx = Math.floor(Math.random() * gameList.length - 1);
    if (!gameList[randIdx]) {
      return { ...gameList[0], ...item };
    }
    return { ...gameList[randIdx], ...item };
  });

  const top10hof = gameDistPie(data.hof, 11)
    .map((item) => {
      const gameList = data.hof.filter(
        (shot) => shot.gameName === item.label && !!shot.thumbnailUrl,
      );
      const randIdx = Math.floor(Math.random() * gameList.length - 1);
      return { ...gameList[randIdx], ...item };
    })
    .filter((item) => !!item.thumbnailUrl);

      const top3Shots = data.hof
    .filter((shot) => !!shot.thumbnailUrl && !!shot.score)
    .sort((a, b) => (b.score || 0) - (a.score || 0))
    .slice(0, 3);


  const leaderboardData: LeaderboardEntry[] = guessTheVPData
  .map(([authorId, score]: [string, number]) => {
    // Find the author info by matching the authorId
    // TODO: Use the Author type here
    const author: any | undefined = data.authors.find(
      (entry: any) => entry.authorid === authorId
    );

    // If the author is found, extract the needed information
    if (author) {
      return {
        id: authorId,
        avatar: author.authorsAvatarUrl,
        name: author.authorNick,
        score,
      };
    }

    // If the author is not found, skip this entry
    return null;
  })
  .filter((entry): entry is LeaderboardEntry => entry !== null) // Type guard for non-null entries
  .sort((a, b) => b.score - a.score)
  .slice(0, 10);

  const recapLogoStyle: CSS.Properties = {
    position: 'relative',
    marginTop: '10px',
    marginBottom: '20px',
    padding: '0px 20px',
    left: '50%',
    width: '500px',
    transform: 'translate(-50%, 0%)',
  }

  const imageShadowStyle = {filter: "drop-shadow(0px 5px 5px #00000077)"}

  const isWindowARVertical = typeof window !== "undefined" && window.innerWidth / window.innerHeight < 1;

  return (
    <>
      <Head>
        <title>A Year of FRAMED: {year}</title>
      </Head>
      <LoadWrapper>
        <main className="relative">
          <div className="relative z-10 bg-framed-black/60">
            <Container className="pt-20 md:pt-0">
              <div className="min-h-screen md:flex md:items-center load transition-all -translate-y-10 opacity-0 duration-1000 mb-8">
                <div className="md:grid md:grid-cols-2 md:gap-x-16">
                  <div className="flex flex-col justify-center">
                    <img src={`${basePath}/recap-wsub-logo.svg`} style={ recapLogoStyle } alt="recap logo"/>
                    <br />
                    <p>
                      Welcome to Framed&apos;s {year} in Review!
                    </p>
                    <br />
                    { insertFlavourText(flavourText.intro) }
                  </div>
                  <div className="flex flex-col justify-center">
                    <div className="grid grid-cols-3 gap-4 aspect-square mt-8 md:mt-32" style = { imageShadowStyle }>
                      {grid.map((item, index) => {
                        return (
                          <a
                            key={`${item.author}-${index}`}
                            className="relative aspect-square overflow-hidden load transition-all -translate-y-10 opacity-0 duration-1000"
                            href= { getHOFUrl(item) }
                            target="_blank"
                            rel="noreferrer"
                          >
                            <div className="absolute w-full h-full transition-all duration-500 opacity-0 translate-y-5 hover:opacity-100 hover:translate-y-0">
                              <p
                                className={`
                            absolute bottom-0 left-0 right-0 text-white text-sm p-3
                            bg-gradient-to-t from-black/75
                          `}
                              >
                                {item.gameName}
                                <br />
                                <span className="text-white/75 text-xs">
                                  {item.author}
                                </span>
                              </p>
                            </div>
                            <picture>
                              <img
                                loading="lazy"
                                className="rounded-md object-cover w-full h-full aspect-square"
                                alt={item.gameName}
                                src={`${item.thumbnailUrl?.replace(
                                  "https://cdn.discordapp.com",
                                  "https://media.discordapp.net",
                                )}?width=600&height=600`}
                                //src={ index === 0 ? item.shotUrl : item.thumbnailUrl}
                              />
                            </picture>
                          </a>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
              <div className="min-h-screen flex flex-col justify-center load transition-all -translate-y-10 opacity-0 duration-1000 mb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16">
                  <div className="hidden md:grid grid-cols-3" style = { imageShadowStyle }>
                    {categoriesImages.map((item, index) => {
                      return (
                        <a
                          key={`${item.author}-${index}`}
                          className="relative overflow-hidden aspect-auto load transition-all -translate-y-10 opacity-0 duration-1000"
                          href= { getHOFUrl(item) }
                          target="_blank"
                          rel="noreferrer"
                        >
                          <div className="absolute w-full h-full transition-all duration-500 opacity-0 translate-y-5 hover:opacity-100 hover:translate-y-0">
                            <p
                              className={`
                            absolute bottom-0 left-0 right-0 p-4
                            bg-gradient-to-t from-black/75
                          `}
                            >
                              {item.gameName}
                              <br />
                              <span className="text-white/75 text-xs text-right">
                                {item.author}
                              </span>
                            </p>
                          </div>
                          <picture>
                            <img
                              loading="lazy"
                              className={`
                            object-cover h-full
                            ${
                              index === 0
                                ? "rounded-tl-md rounded-bl-md"
                                : index === 2
                                ? "rounded-tr-md rounded-br-md"
                                : ""
                            }
                            `}
                              alt={item.gameName}
                              src={`${item.thumbnailUrl?.replace(
                                "https://cdn.discordapp.com",
                                "https://media.discordapp.net",
                              )}?width=600&height=600`}
                            />
                          </picture>
                        </a>
                      );
                    })}
                  </div>
                  <div>
                    <h2 className="text-6xl font-semibold mb-8">Categories</h2>
                    {Object.keys(segments).map((key) => {
                      return (
                        <div key={key} className="mb-8" ref={segments[key]}>
                          <div className="flex flex-col justify-center">
                            <button
                              className="text-left"
                              onClick={() => {
                                if (segments[key].current) {
                                  segments[key].current?.scrollIntoView({
                                    behavior: "smooth",
                                    block: "start",
                                  });
                                }
                              }}
                            >
                              <h3 className="text-3xl font-semibold">{key}</h3>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
              <div
                className="min-h-screen flex items-center load transition-all -translate-y-10 opacity-0 duration-1000 mb-8"
                ref={segments["Top 10 Games in Share Your Shot"]}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16">
                  <div className="md:grid md:grid-rows-2">
                    <div className="h-auto flex flex-col justify-end">
                      <h2 className="md:text-6xl text-3xl font-semibold mb-8">
                        Top 10 Games in Share Your Shot
                      </h2>
                      { insertFlavourText(flavourText.top10sys) }
                    </div>
                    <div
                    className="flex"
                    style={{
                      height: isWindowARVertical ? '35vh' : '40vh',
                    }}
                    >
                      <Pie
                        data={gameDistPie(
                          (data.sys as IShot[]).filter(
                            (shot) =>
                              new Date(shot.date).getTime() >=
                                new Date(`${ year }-01-01`).getTime() &&
                              new Date(shot.date).getTime() <=
                                new Date(`${ year }-12-31`).getTime(),
                          ),
                          11,
                        )}
                        tooltip={(d) => (
                          <div className="bg-framed-black text-framed-white py-1 px-3 rounded-md shadow-md">
                            {d.datum.label}: <strong>{d.datum.value}</strong>{" "}
                            shots
                          </div>
                        )}
                      />
                    </div>
                  </div>
                  <div className="flex flex-col justify-center">
                    <div className="grid grid-cols-3 grid-rows-3 gap-4" style = { imageShadowStyle }>
                      {top10sys.map((item, index) => {
                        // dont render images if it cant complete the row.
                        //if (top10sys.length%3 !== 0 && index >= top10sys.length - top10sys.length%3 - 1){
                        //  return null;
                        //}
                        return (
                          <a
                            key={`${item.author}-${index}`}
                            className={`
                            relative load transition-all -translate-y-10 opacity-0 duration-1000
                            ${index === 0 ? "col-span-1 row-span-2" : ""}
                          `}
                            href= { getHOFUrl(item) }
                            target="_blank"
                            rel="noreferrer"
                          >
                            <div className="absolute w-full h-full transition-all duration-500 opacity-100 aspect-square">
                              <div
                                className={`
                            absolute bottom-0 left-0 right-0  p-4
                            bg-gradient-to-t from-black/75
                          `}
                              >
                                <p className="text-framed-white font-semibold text-xs md:text-base">
                                  {item.gameName}
                                  <br />
                                </p>
                                <p className="text-white/50 font-medium text-sm">
                                  {item.value} shots
                                    <br />
                                </p>
                                <p className="text-white/75 text-xs text-right">
                                  {item.author}
                                </p>
                              </div>
                            </div>
                            <picture>
                              <img
                                loading="lazy"
                                className="rounded-md object-cover w-full h-full aspect-square"
                                alt={item.gameName}
                                src={`${item.thumbnailUrl?.replace(
                                  "https://cdn.discordapp.com",
                                  "https://media.discordapp.net",
                                )}?width=600&height=600`}
                                //src={ index === 0 ? item.shotUrl : item.thumbnailUrl}
                              />
                            </picture>
                          </a>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
              <div
                className="min-h-screen flex items-center load transition-all -translate-y-10 opacity-0 duration-1000 mb-8"
                ref={segments["Top 10 Games in the Hall of Framed"]}
              >
                <div className="grid md:grid-rows-none md:grid-cols-2 gap-x-16">
                  <div className="md:flex md:flex-col md:justify-center">
                    <div className="grid grid-cols-3 grid-rows-3 gap-4" style = { imageShadowStyle } >
                      {top10hof.map((item, index) => {
                        return (
                          <a
                            key={`${item.author}-${index}`}
                            className={`
                            relative load transition-all -translate-y-10 opacity-0 duration-1000
                            ${index === 0 ? "col-span-1 row-span-2" : ""}
                          `}
                            href= { getHOFUrl(item) }
                            target="_blank"
                            rel="noreferrer"
                          >
                            <div className="absolute w-full h-full transition-all duration-500 opacity-100 aspect-square">
                              <div
                                className={`
                            absolute bottom-0 left-0 right-0 p-4
                            bg-gradient-to-t from-black/75
                          `}
                              >
                                <p className="text-framed-white font-semibold text-xs md:text-base">
                                  {item.gameName}
                                  <br />
                                </p>
                                <p className="text-white/50 font-medium text-sm">
                                  {item.value} shots
                                    <br />
                                </p>
                                <p className="text-white/75 text-xs text-right">
                                  {item.author}
                                </p>
                              </div>
                            </div>
                            <picture>
                              <img
                                loading="lazy"
                                className="rounded-md object-cover w-full h-full aspect-square"
                                alt={item.gameName}
                                src={`${item.thumbnailUrl?.replace(
                                  "https://cdn.discordapp.com",
                                  "https://media.discordapp.net",
                                )}?width=600&height=600`}
                                //src={ index === 0 ? item.shotUrl : item.thumbnailUrl}
                              />
                            </picture>
                          </a>
                        );
                      })}
                    </div>
                  </div>
                  <div className="order-first md:order-none md:grid md:grid-rows-2">
                    <div className="md:h-auto md:flex md:flex-col md:justify-end">
                      <h2 className="text-3xl md:text-6xl font-semibold mb-8">
                        Top 10 Games in the Hall of Framed
                      </h2>
                      { insertFlavourText(flavourText.top10hof) }
                    </div>
                    <div
                    className="flex"
                    style={{
                      height: isWindowARVertical ? '35vh' : '40vh',
                    }}
                    >
                      <Pie
                        data={gameDistPie(
                          (data.hof as IShot[]).filter(
                            (shot) =>
                              new Date(shot.date).getTime() >=
                                new Date(`${ year }-01-01`).getTime() &&
                              new Date(shot.date).getTime() <=
                                new Date(`${ year }-12-31`).getTime(),
                          ),
                          11,
                        )}
                        tooltip={(d) => (
                          <div className="bg-framed-black text-framed-white py-1 px-3 rounded-md shadow-md">
                            {d.datum.label}: <strong>{d.datum.value}</strong>{" "}
                            shots
                          </div>
                        )}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div
                className="min-h-screen flex items-center load transition-all -translate-y-10 opacity-0 duration-1000 mb-16"
                ref={segments["Most Active Day in Share Your Shot"]}
              >
                <div className="grid grid-rows-2 md:grid-rows-none md:grid-cols-2 gap-x-16">
                  <div className="grid md:grid-rows-2">
                    <div className="h-auto flex flex-col justify-end">
                      <h2 className="text-3xl md:text-6xl font-semibold mb-8">
                        Most Active Day in Share Your Shot
                      </h2>
                      <h3 className="text-2xl md:text-4xl font-semibold mb-8">
                        {new Date(
                          calendarDataFormat(data.sys).sort(
                            (a, b) => b.value - a.value,
                          )[0].day,
                        ).toLocaleDateString("en-US", {
                          timeZone: "UTC",
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </h3>
                      { insertFlavourText(flavourText.busysys) }
                    </div>
                    <div
                    className="flex"
                    style={{
                      height: isWindowARVertical ? '35vh' : '40vh',
                    }}
                    >
                      <Pie
                        data={gameDistPie(
                          calendarDataFormat(data.sys).sort(
                            (a, b) => b.value - a.value,
                          )[0].shots,
                          11,
                        )}
                        tooltip={(d) => (
                          <div className="bg-framed-black text-framed-white py-1 px-3 rounded-md shadow-md">
                            {d.datum.label}: <strong>{d.datum.value}</strong>{" "}
                            shots
                          </div>
                        )}
                      />
                    </div>
                  </div>
                  <div className="flex flex-col justify-center">
                    <div className="grid grid-cols-3 grid-rows-3 gap-4" style = { imageShadowStyle }>
                      {mostActiveSys.slice(0, 10).map((item, index) => {
                        return (
                          <a
                            key={`${item.author}-${index}`}
                            className={`
                            relative load transition-all -translate-y-10 opacity-0 duration-1000
                            ${index === 0 ? "col-span-1 row-span-2" : ""}
                          `}
                            href= { getHOFUrl(item) }
                            target="_blank"
                            rel="noreferrer"
                          >
                            <div className="absolute w-full h-full transition-all duration-500 opacity-100 aspect-square">
                              <div
                                className={`
                            absolute bottom-0 left-0 right-0  p-4
                            bg-gradient-to-t from-black/75
                          `}
                              >
                                <p className="text-framed-white font-semibold text-xs md:text-base">
                                  {item.gameName}
                                  <br />
                                </p>
                                <p className="text-white/50 font-medium text-sm">
                                  {item.value} shots
                                    <br />
                                </p>
                                <p className="text-white/75 text-xs text-right">
                                  {item.author}
                                </p>
                              </div>
                            </div>
                            <picture>
                              <img
                                loading="lazy"
                                className="rounded-md object-cover w-full h-full aspect-square"
                                alt={item.gameName}
                                src={`${item.thumbnailUrl?.replace(
                                  "https://cdn.discordapp.com",
                                  "https://media.discordapp.net",
                                )}?width=600&height=600`}
                                //src={ index === 0 ? item.shotUrl : item.thumbnailUrl}
                              />
                            </picture>
                          </a>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
              <div
                className="min-h-screen flex items-center load transition-all -translate-y-10 opacity-0 duration-1000 mb-16 md:mb-0"
                ref={segments["Most Active Day in the Hall of Framed"]}
              >
                <div className="grid grid-rows-2 md:grid-rows-none md:grid-cols-2 gap-x-16">
                  <div className="md:flex flex-col justify-center">
                    <div className="grid grid-cols-3 grid-rows-3 gap-4" style = { imageShadowStyle }>
                      {mostActiveHof.slice(0, 10).map((item, index) => {
                        return (
                          <a
                            key={`${item.author}-${index}`}
                            className={`
                            relative load transition-all -translate-y-10 opacity-0 duration-1000
                            ${index === 0 ? "col-span-1 row-span-2" : ""}
                          `}
                            href= { getHOFUrl(item) }
                            target="_blank"
                            rel="noreferrer"
                          >
                            <div className="absolute w-full h-full transition-all duration-500 opacity-100 aspect-square">
                              <div
                                className={`
                            absolute bottom-0 left-0 right-0 p-4
                            bg-gradient-to-t from-black/75
                          `}
                              >
                                <p className="text-framed-white font-semibold text-xs md:text-base">
                                  {item.gameName}
                                  <br />
                                </p>
                                <p className="text-white/50 font-medium text-sm">
                                  {item.value} shots
                                    <br />
                                </p>
                                <p className="text-white/75 text-xs text-right">
                                  {item.author}
                                </p>
                              </div>
                            </div>
                            <picture>
                              <img
                                loading="lazy"
                                className="rounded-md object-cover w-full h-full aspect-square"
                                alt={item.gameName}
                                src={`${item.thumbnailUrl?.replace(
                                  "https://cdn.discordapp.com",
                                  "https://media.discordapp.net",
                                )}?width=600&height=600`}
                                //src={ index === 0 ? item.shotUrl : item.thumbnailUrl}
                              />
                            </picture>
                          </a>
                        );
                      })}
                    </div>
                  </div>
                  <div className="md:grid md:grid-rows-2 order-first md:order-none">
                    <div className="h-auto flex flex-col justify-end">
                      <h2 className="text-3xl md:text-6xl font-semibold mb-8">
                        The Most Active Day in the Hall of Framed
                      </h2>
                      <h3 className="text-2xl font-semibold mb-4">
                        {new Date(
                          calendarDataFormat(data.hof).sort(
                            (a, b) => b.value - a.value,
                          )[0].day,
                        ).toLocaleDateString("en-US", {
                          timeZone: "UTC",
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </h3>
                      { insertFlavourText(flavourText.busyhof) }
                    </div>
                    <div
                    className="flex"
                    style={{
                      height: isWindowARVertical ? '35vh' : '40vh',
                    }}
                    >
                      <Pie
                        data={gameDistPie(
                          calendarDataFormat(data.hof).sort(
                            (a, b) => b.value - a.value,
                          )[0].shots,
                          11,
                        )}
                        tooltip={(d) => (
                          <div className="bg-framed-black text-framed-white py-1 px-3 rounded-md shadow-md">
                            {d.datum.label}: <strong>{d.datum.value}</strong>{" "}
                            shots
                          </div>
                        )}
                      />
                    </div>
                  </div>
                </div>
              </div>

                 <div
                className="min-h-screen flex items-center load transition-all -translate-y-10 opacity-0 duration-1000 mb-16"
                ref={segments["Top 3 Shots of the Year"]}
              >
                <div className="w-full">
                  <div className="text-center mb-12">
                    <h2 className="md:text-6xl text-3xl font-semibold mb-8">
                      Top 3 Shots of the Year
                    </h2>
                    <p className="max-w-3xl mx-auto">Every year, the community rallies around exceptional shots that capture the essence of virtual photography. These are the most celebrated shots of {year}, earning the highest number of votes from our members.</p>
                  </div>
                  <div className="md:hidden flex flex-col gap-6">
                    {top3Shots.map((item, index) => {
                      const medalColors = [
                        "text-yellow-400",
                        "text-gray-300",
                        "text-amber-600"
                      ];
                      const medalEmojis = ["🥇", "🥈", "🥉"];

                      return (
                        <a
                          key={`mobile-${item.author}-${item.epochTime}`}
                          className="block w-full load transition-all -translate-y-10 opacity-0 duration-1000"
                          href={getHOFUrl(item)}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <div
                            className="relative rounded-lg overflow-hidden"
                            style={{
                              filter: 'drop-shadow(0px 5px 15px #00000077)',
                            }}
                          >
                            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 via-black/60 to-transparent z-20">
                              <div className="flex items-center gap-3">
                                <span className={`text-3xl ${medalColors[index]}`}>
                                  {medalEmojis[index]}
                                </span>
                                <div>
                                  <p className="text-framed-white font-semibold text-base mb-1">
                                    {item.gameName}
                                  </p>
                                  <p className="text-white/75 text-xs">
                                    by {item.author}
                                  </p>
                                </div>
                              </div>
                            </div>
                            <picture>
                              <img
                                loading="lazy"
                                className="rounded-lg w-full h-auto"
                                alt={item.gameName}
                                src={`${item.thumbnailUrl}?width=800`}
                              />
                            </picture>
                          </div>
                        </a>
                      );
                    })}
                  </div>

                  {/* Desktop Layout - original 3-column grid with hover effects */}
                  <div className="hidden md:grid md:grid-cols-3 gap-8">
                    {top3Shots.map((item, index) => {
                      const medalColors = [
                        "text-yellow-400",
                        "text-gray-300",
                        "text-amber-600"
                      ];
                      const medalEmojis = ["🥇", "🥈", "🥉"];
                      const orderClass = index === 0 ? "md:order-2" : index === 1 ? "md:order-1" : "md:order-3";
                      const marginStyle = index === 0 ? {} : index === 1 ? {marginTop: '4rem'} : {marginTop: '6rem'};

                      const imageAspectRatio = item.width && item.height ? item.width / item.height : 16/9;
                      const croppedAspectRatio = 3/4;
                      const baseHeight = 600;
                      const croppedWidth = baseHeight * croppedAspectRatio;

                      const isLandscape = imageAspectRatio > croppedAspectRatio;
                      const fullWidth = isLandscape ? baseHeight * imageAspectRatio : croppedWidth;
                      const fullHeight = isLandscape ? baseHeight : croppedWidth / imageAspectRatio;

                      return (
                        <div
                          key={`${item.author}-${item.epochTime}`}
                          className={`relative ${orderClass}`}
                          style={{
                            ...marginStyle,
                            width: `${croppedWidth}px`,
                            height: `${baseHeight}px`,
                            zIndex: 0,
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.zIndex = '50';
                          }}
                          onMouseLeave={(e) => {
                            const target = e.currentTarget;
                            setTimeout(() => {
                              if (target && target.style) {
                                target.style.zIndex = '0';
                              }
                            }, 500);
                          }}
                        >
                          <a
                            className="block absolute overflow-visible load transition-all -translate-y-10 opacity-0 duration-1000 group"
                            href={getHOFUrl(item)}
                            target="_blank"
                            rel="noreferrer"
                            style={{
                              left: '50%',
                              top: '50%',
                              transform: 'translate(-50%, -50%)',
                            }}
                          >
                            <div
                              className="relative rounded-lg overflow-hidden transition-all duration-500"
                              style={{
                                height: `${baseHeight}px`,
                                width: `${croppedWidth}px`,
                                filter: 'drop-shadow(0px 5px 5px #00000077)',
                                transition: 'width 0.5s ease-in-out, height 0.5s ease-in-out, filter 0.5s ease-in-out',
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.width = `${fullWidth}px`;
                                e.currentTarget.style.height = `${fullHeight}px`;
                                e.currentTarget.style.filter = 'drop-shadow(0px 20px 40px #000000cc)';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.width = `${croppedWidth}px`;
                                e.currentTarget.style.height = `${baseHeight}px`;
                                e.currentTarget.style.filter = 'drop-shadow(0px 5px 5px #00000077)';
                              }}
                            >
                              <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 bg-gradient-to-t from-black/90 via-black/60 to-transparent z-20">
                                <div className="flex items-center gap-3 md:gap-4">
                                  <span className={`text-3xl md:text-5xl ${medalColors[index]}`}>
                                    {medalEmojis[index]}
                                  </span>
                                  <div>
                                    <p className="text-framed-white font-semibold text-base md:text-xl mb-1">
                                      {item.gameName}
                                    </p>
                                    <p className="text-white/75 text-xs md:text-sm">
                                      by {item.author}
                                    </p>
                                  </div>
                                </div>
                              </div>
                              <picture>
                                <img
                                  loading="lazy"
                                  className="rounded-lg object-cover w-full h-full"
                                  alt={item.gameName}
                                  src={`${item.thumbnailUrl}?width=800`}
                                />
                              </picture>
                            </div>
                          </a>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div
                className="min-h-screen flex items-center load transition-all -translate-y-10 opacity-0 duration-1000 mb-8"
                ref={segments["Guess the VP yearly leadboard"]}
                style={ {display: leaderboardData.length === 0 ? 'none' : 'block'} }
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16">
                  <div className="md:grid md:grid-rows-2">
                    <div className="h-auto flex flex-col justify-end">
                      <h2 className="md:text-6xl text-3xl font-semibold mb-8">
                        Guess the VP yearly leadboard
                      </h2>
                      <p>With so many amazing shots spread out across a wide selection of games over the last few years, we decided to take the competitive nature of our members and turn it into a fun little game of Guess Who. Every member has a style, a vibe, or a signature within their work, and often we find that we’re able to spot those personal flourishes when looking at a shot. In Guess the VP, the all knowing FramedBot picks out a random shot and tasks players with identifying who posted it, awarding the successful candidate with absolutely nothing but satisfaction of being right. </p>
                      <br />
                      <p>For the competitive few who frequent the games, we’ve tallied up all of the points for this year and this is how it went.</p>
                    </div>
                  </div>
                  <div className="flex flex-col justify-center">
                    <Leaderboard
                      leaderboardData={leaderboardData}
                      isWindowARVertical={isWindowARVertical}
                    />
                  </div>
                </div>
              </div>

              <div
              className="calendar h-auto grid grid-rows-2 gap-x-8 md:overflow-hidden"
              style={{
                width: isWindowARVertical ? 'auto' : '300%',
                marginLeft: isWindowARVertical ? 'auto' : '-100%',
                padding: isWindowARVertical ? 0 : '20px',
              }}
              >
                <div
                  className="flex flex-col items-center"
                  style={{
                    height: isWindowARVertical ? '150vh' : '50vh',
                    width: isWindowARVertical ? '70vw' : '80vw',
                    flex: 1,
                    margin: "auto",
                  }}
                  ref={segments["Daily Share Your Shot"]}
                >
                  <h3 className="font-semibold text-3xl text-center">
                    Share Your Shot Calendar in {year}
                  </h3>
                  <Calendar
                    data={calendarDataFormat(data.sys)}
                    onClick={(d) => {
                      setCalendarDatum(d as any as CalendarTooltipProps);
                      setVisible(true);
                    }}
                    from={new Date(`${ year }-01-02`)}
                    to={new Date(`${ year }-12-31`)}
                    tooltip={CustomTooltip}
                  />
                </div>
                <div
                  className="flex flex-col items-center"
                  style={{
                    height: isWindowARVertical ? '150vh' : '50vh',
                    width: isWindowARVertical ? '70vw' : '80vw',
                    flex: 1,
                    margin: "auto",
                  }}
                  ref={segments["Daily Hall of Framed"]}
                >
                  <h3 className="font-semibold text-3xl text-center">
                    Hall of Framed Calendar in {year}
                  </h3>
                  <Calendar
                    data={calendarDataFormat(data.hof)}
                    onClick={(d) => {
                      setCalendarDatum(d as any as CalendarTooltipProps);
                      setVisible(true);
                    }}
                    from={new Date(`${ year }-01-02`)}
                    to={new Date(`${ year }-12-31`)}
                    tooltip={CustomTooltip}
                  />
                </div>
              </div>
            </Container>
          </div>
          <picture>
            <img
              loading="lazy"
              className="absolute top-0 left-0 w-full h-full object-cover"
              src="wrapped-images/Topography.svg"
              alt=""
            />
          </picture>
        </main>
      </LoadWrapper>
      {calendarDatum && Number(calendarDatum.value) > 0 ?
        <Modal
          open={visible}
          onClose={() => {
            setVisible(false);
            setCalendarDatum(undefined);
          }}
        >
          {calendarDatum && <ModalContent data={calendarDatum} />}
        </Modal>
        : null
      }
    </>
  );
}
