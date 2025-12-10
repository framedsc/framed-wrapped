import React, { useRef, useEffect, useState, RefObject } from "react";
import CSS from 'csstype';
import { IShot } from "@types";
import { covers2021, covers2022, covers2023, covers2024, covers2025 } from "./covers-lists";
import { basePath } from '../../next.config';

const getCovers = (year: number) => {
  switch(year) { 
    case 2021: { 
      return covers2021;
   } 
    case 2022: { 
       return covers2022;
    } 
    case 2023: { 
      return covers2023;
   } 
   case 2024: { 
    return covers2024;
   } 
  case 2025: { 
    return covers2025;
   } 
    default: { 
      return [];
    } 
 } 
}

function getCoverContainerStyle() {
  const coverContainerStyle: CSS.Properties = {
    position: 'relative',
    marginBottom: `${typeof window !== 'undefined' && window.innerWidth / window.innerHeight < 1 ? 4 : 1}%`,
  
    height: '0',
    minWidth: '360px',
    minHeight: '480px',
    overflow: 'hidden',
    textAlign: 'center',
    filter: 'drop-shadow(0 5px 0.75rem rgba(0, 0, 0, 0.5))',
  };

  if (typeof window !== 'undefined'){
    const windowAR = window.innerWidth / window.innerHeight;
    const coverAR = 4/3;

    coverContainerStyle['minWidth'] = `${windowAR < 1 ? window.innerWidth * 0.93 : window.innerHeight * 1/coverAR * 0.8}px`;
    coverContainerStyle['minHeight'] = `${windowAR < 1 ? window.innerWidth * coverAR * 0.93 : window.innerHeight * 0.8}px`;
  }

  return coverContainerStyle;
}

const coverImageStyle: CSS.Properties = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    objectPosition: 'center',
    position: 'absolute',
    top: 0, left: 0
}

const coverFrameStyle: CSS.Properties = {
  position: 'absolute',
  top: '3.5cqw', /* Adjust top position */
  left: '3.5cqw', /* Adjust left position */
  right: '3.5cqw', /* Adjust right position */
  bottom: '3.5cqw', /* Adjust bottom position */
  backdropFilter: 'blur(20px) brightness(115%) saturate(120%)',
  mask:
    'linear-gradient(transparent 0%, white 0%, white 2.33%, 2.33%, transparent 97.66%, white 97.66%, white 100%, transparent 100%), linear-gradient(0.25turn, transparent 0%, white 0%, white 3.12%, transparent 3.12%, transparent 96.88%, 96.88%, white 100%, transparent 100%)',
  WebkitMask:
    'linear-gradient(transparent 0%, white 0%, white 2.33%, 2.33%, transparent 97.66%, white 97.66%, white 100%, transparent 100%), linear-gradient(0.25turn, transparent 0%, white 0%, white 3.12%, transparent 3.12%, transparent 96.88%, 96.88%, white 100%, transparent 100%)',
}

const framedTextStyle: CSS.Properties = {
  position: 'absolute',
  top: '12.5%',
  left: '50%',
  fontStyle: 'normal',
  fontWeight: 700,
  fontSize: `19.5cqi`,
  textAlign: 'center',
  transform: 'translate(-50%, -50%)',
  opacity: '90%',
  //fontFamily: "Galano Grotesque Alt",
  letterSpacing: "-0.05em",
  filter: "drop-shadow(0px 5px 5px #00000035)",
}

const yearTextStyle: CSS.Properties = {
  position: 'absolute',
  top: '85%',
  left:' 50%',
  fontWeight: 'lighter',
  fontSize: '14cqw',
  textAlign: 'center',
  transform: 'translate(-50%, -50%)',
  opacity: '80%',
  mixBlendMode: 'screen',
  filter: "drop-shadow(0px 5px 5px #00000035)",
  fontFamily: "'Galano Grotesque Alt (Numbers)', 'AtkinsonHyperlegible', 'HelveticaNeue', 'Helvetica', 'Arial', 'sans-serif'",
  //color: '#dbdfd8',
}

const creditsTextStyle: CSS.Properties = {
  position: 'absolute',
  bottom: '0.5%',
  left: '50%',
  //fontWeight: 'bold',
  fontStyle: 'italic',
  fontSize: '10px',
  textAlign: 'center',
  transform: 'translate(-50%, 0%)',
  opacity: '25%',
  //mix-blend-mode: 'screen',
  //color: '#dbdfd8',
}

export function YearCover(year: number, firstCover: boolean = false) {
  const covers = getCovers(year);
  const [image1, setImage1] = useState<any | null>(null);
  const [image2, setImage2] = useState<any | null>(null);
  const imageToDisplay = useRef(1);
  const renderInitialized = useRef(false);
  const switchCoverIntervalRef = useRef<NodeJS.Timer | null>(null); // Store the interval ID

  function switchImage() {
    if (imageToDisplay.current === 1) {
      const filteredCovers = covers.filter((cover) => cover !== image1);
      const newImage = filteredCovers[Math.floor(Math.random() * (filteredCovers.length))];
      setImage2(newImage);
      imageToDisplay.current = 2;
    } else {
      const filteredCovers = covers.filter((cover) => cover !== image2);
      const newImage = filteredCovers[Math.floor(Math.random() * (filteredCovers.length))];
      setImage1(newImage);
      imageToDisplay.current = 1;
    }
  }

  useEffect(() => {
    if (!renderInitialized.current) {
      setImage1(covers[Math.floor(Math.random() * covers.length)]);
      setImage2(covers[Math.floor(Math.random() * covers.length)]);

      renderInitialized.current = true;
    }

    const startSwitchCoverInterval = (timeInterval: number) => {
      if (switchCoverIntervalRef.current) {
        clearInterval(switchCoverIntervalRef.current); // Clear any existing interval
      }
  
      const intervalId = setInterval(() => {
        switchImage();
      }, timeInterval);
  
      switchCoverIntervalRef.current = intervalId;
    };

    const changeCoversEveryMs: number = 7500;
    const numberOfPastCovers: number = 4;
    const delay = firstCover ? changeCoversEveryMs : (year - 2020) * changeCoversEveryMs;
    const timeoutId = setTimeout(() => {
      switchImage();
      startSwitchCoverInterval((firstCover ? 1 : numberOfPastCovers) * changeCoversEveryMs);
    }, delay);

    return () => {
      clearTimeout(timeoutId); // Cleanup timeout
      if (switchCoverIntervalRef.current) {
        clearInterval(switchCoverIntervalRef.current); // Clear the interval on cleanup
        switchCoverIntervalRef.current = null;
      }
    };
  }, [year, firstCover]);

  if ((imageToDisplay.current === 1 && image1 === null) || (imageToDisplay.current === 2 && image2 === null)) {
    return null;
  }

  function imageElement(imageURL: string, shouldDisplay: boolean) {
    return (
      <div className="shot-wrapper" style={{ ...coverImageStyle, position: 'absolute', opacity: shouldDisplay ? 1 : 0, transition: 'opacity 0.5s' }}>
        <img src={`${basePath}/${imageURL}`} loading="lazy" style={coverImageStyle} />
      </div>
    );
  }

  return (
      <a className="year-cover-container" href={`${basePath}/${year.toString()}`} style={getCoverContainerStyle()}>
        {imageElement(image1.shotUrl, imageToDisplay.current === 1)}
        {imageElement(image2.shotUrl, imageToDisplay.current === 2)}
        <div className="year-cover-frame" style={coverFrameStyle}></div>
        <h1 className="text cover-framed-text font-galanogrotesque" style={framedTextStyle}>
          FRAMED
        </h1>
        <h2 className="cover-year-text" style={yearTextStyle}>
          {year}
        </h2>
      </a>
    );
}
