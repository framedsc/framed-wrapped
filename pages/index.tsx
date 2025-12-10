import Head from "next/head";
import React, { useState, useEffect } from "react";
import CSS from 'csstype';
import { basePath } from '../next.config';

import { YearCover} from "@components/home";

const coverFrameStyle: CSS.Properties = {
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  alignItems: 'center',
  justifyContent: 'space-around',
  //transform: 'translate(0%, -50%%)',
  //top: '50%',
  marginBottom: "3vh",
}


const Home = () => {
  const [isPortrait, setIsPortrait] = useState(true);

  useEffect(() => {
    const checkOrientation = () => {
      setIsPortrait(window.innerHeight > window.innerWidth);
    };

    checkOrientation(); // Set initial orientation on mount
    window.addEventListener("resize", checkOrientation);

    return () => window.removeEventListener("resize", checkOrientation);
  }, []);

  const leftIntroStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    //position: 'relative',
    paddingLeft: '20px',
    //left: '50%',
    width: '80vh',
    //transform: 'translate(-50%, 0%)',
    //overflow: 'auto',
    alignItems: 'center',
    margin: isPortrait ? '0vh 0 4vh' : '10vh 0 4vh',
    paddingRight: isPortrait ? '20px' : '60px'
  }

  const recapLogoStyle: CSS.Properties = {
    display: 'flex',
    //position: 'relative',
    margin: isPortrait ? '0vh 0 3vh' : '6vh 0 6vh',
    //padding: isWindowARVertical() ? '0px 100px' : '0px 20px',
    //left: '50%',
    //transform: 'translate(-50%, 0%)',
    //overflow: 'auto',
    alignItems: 'center',
  }

  const introTextStyle: CSS.Properties = {
    //left: '50%',
    paddingBottom: isPortrait ? '0px' : '125px',
    textAlign: 'justify',
  }

  const firstCoverFrameStyle: CSS.Properties = {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
    //transform: 'translate(0%, -50%%)',
    //top: '50%',
    paddingTop: "10vh",
    paddingBottom: isPortrait ? '0px' : '50px',
  }

  return (
    <>
      <Head>
        <title>A year of FRAMED</title>
      </Head>

      <div className='Intro Section wrapper' style={ firstCoverFrameStyle }>
        <div className='test' style={ leftIntroStyle }>
          <img src={`${basePath}/recap-wsub-logo.svg`} style={ recapLogoStyle } alt="recap logo"/>
          <div className="h-auto flex flex-col justify-end" style={ introTextStyle }>
            <p>
            At the end of every year, we like to take a beat and look back over the indelible works of our talented community.
            Members of the Framed Discord server have poured countless hours into games new and old,
            stopping time to capture timeless images.

            <br/><br/>

            We&apos;ve made sure to dive deep into the heart of virtual photography and break down our members&apos;
            photographing habits for each year, so join us as we reflect on what has been happening in the wonderful world of virtual photography.
            It&apos;s been another landmark year for video games and virtual photography alike, and we&apos;re looking forward to the next one.
            </p>
          </div>
        </div>
        { YearCover(2025, true) }
      </div>
      <div className='Covers wrapper' style={ coverFrameStyle }>
        { YearCover(2024) }
        { YearCover(2023) }
        { YearCover(2022) }
        { YearCover(2021) }
      </div>
    </>
  );
};

export default Home;
