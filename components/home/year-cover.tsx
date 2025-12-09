import React, { useRef, useEffect, useState, RefObject } from "react";
import CSS from "csstype";
import { IShot } from "@types";
import { covers2021, covers2022, covers2023, covers2024 } from "./covers-lists";
import { basePath } from "../../next.config";

const getCovers = (year: number) => {
  switch (year) {
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
    default: {
      return [];
    }
  }
};

function getCoverContainerStyle() {
  const coverContainerStyle: CSS.Properties = {
    position: "relative",
    marginBottom: `${
      typeof window !== "undefined" &&
      window.innerWidth / window.innerHeight < 1
        ? 4
        : 1
    }%`,

    height: "0",
    minWidth: "360px",
    minHeight: "480px",
    overflow: "hidden",
    textAlign: "center",
    filter: "drop-shadow(0 5px 0.75rem rgba(0, 0, 0, 0.5))",
  };

  if (typeof window !== "undefined") {
    const windowAR = window.innerWidth / window.innerHeight;
    const coverAR = 4 / 3;

    coverContainerStyle["minWidth"] = `${
      windowAR < 1
        ? window.innerWidth * 0.93
        : ((window.innerHeight * 1) / coverAR) * 0.8
    }px`;
    coverContainerStyle["minHeight"] = `${
      windowAR < 1
        ? window.innerWidth * coverAR * 0.93
        : window.innerHeight * 0.8
    }px`;
  }

  return coverContainerStyle;
}

const coverImageStyle: CSS.Properties = {
  width: "100%",
  height: "100%",
  objectFit: "cover",
  objectPosition: "center",
  position: "absolute",
  top: 0,
  left: 0,
};

const coverFrameStyle: CSS.Properties = {
  position: "absolute",
  top: "3.5cqw" /* Adjust top position */,
  left: "3.5cqw" /* Adjust left position */,
  right: "3.5cqw" /* Adjust right position */,
  bottom: "3.5cqw" /* Adjust bottom position */,
  backdropFilter: "blur(20px) brightness(115%) saturate(120%)",
  mask: "linear-gradient(transparent 0%, white 0%, white 2.33%, 2.33%, transparent 97.66%, white 97.66%, white 100%, transparent 100%), linear-gradient(0.25turn, transparent 0%, white 0%, white 3.12%, transparent 3.12%, transparent 96.88%, 96.88%, white 100%, transparent 100%)",
  WebkitMask:
    "linear-gradient(transparent 0%, white 0%, white 2.33%, 2.33%, transparent 97.66%, white 97.66%, white 100%, transparent 100%), linear-gradient(0.25turn, transparent 0%, white 0%, white 3.12%, transparent 3.12%, transparent 96.88%, 96.88%, white 100%, transparent 100%)",
};

const framedTextStyle: CSS.Properties = {
  position: "absolute",
  top: "12.5%",
  left: "50%",
  fontStyle: "normal",
  fontWeight: 700,
  fontSize: `19.5cqi`,
  textAlign: "center",
  transform: "translate(-50%, -50%)",
  opacity: "90%",
  //fontFamily: "Galano Grotesque Alt",
  letterSpacing: "-0.05em",
  filter: "drop-shadow(0px 5px 5px #00000035)",
};

const yearTextStyle: CSS.Properties = {
  position: "absolute",
  top: "85%",
  left: " 50%",
  fontWeight: "lighter",
  fontSize: "14cqw",
  textAlign: "center",
  transform: "translate(-50%, -50%)",
  opacity: "80%",
  mixBlendMode: "screen",
  filter: "drop-shadow(0px 5px 5px #00000035)",
  fontFamily:
    "'Galano Grotesque Alt (Numbers)', 'AtkinsonHyperlegible', 'HelveticaNeue', 'Helvetica', 'Arial', 'sans-serif'",
  //color: '#dbdfd8',
};

const creditsTextStyle: CSS.Properties = {
  position: "absolute",
  bottom: "0.5%",
  left: "50%",
  //fontWeight: 'bold',
  fontStyle: "italic",
  fontSize: "10px",
  textAlign: "center",
  transform: "translate(-50%, 0%)",
  opacity: "25%",
  //mix-blend-mode: 'screen',
  //color: '#dbdfd8',
};

export function YearCover(year: number, firstCover: boolean = false) {
  const covers = getCovers(year);
  const [image1, setImage1] = useState<any | null>(null);
  const [image2, setImage2] = useState<any | null>(null);
  const [activeImage, setActiveImage] = useState<1 | 2>(1);
  const renderInitialized = useRef(false);
  const switchCoverIntervalRef = useRef<NodeJS.Timer | null>(null);
  const isSwitching = useRef(false);

  // Keep refs in sync with state for use in interval callbacks
  const activeImageRef = useRef<1 | 2>(1);
  const image1Ref = useRef<any>(null);
  const image2Ref = useRef<any>(null);

  // Sync refs with state
  useEffect(() => {
    activeImageRef.current = activeImage;
  }, [activeImage]);
  useEffect(() => {
    image1Ref.current = image1;
  }, [image1]);
  useEffect(() => {
    image2Ref.current = image2;
  }, [image2]);

  function preloadImage(url: string): Promise<void> {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve();
      img.onerror = () => resolve();
      img.src = `${basePath}/${url}`;
    });
  }

  const switchImage = useRef(() => {
    // Prevent overlapping transitions
    if (isSwitching.current) return;
    isSwitching.current = true;

    const currentActive = activeImageRef.current;
    const currentImage1 = image1Ref.current;
    const currentImage2 = image2Ref.current;

    if (currentActive === 1) {
      const filteredCovers = covers.filter((cover) => cover !== currentImage1);
      const newImage =
        filteredCovers[Math.floor(Math.random() * filteredCovers.length)];
      // First set the new image in the hidden slot (opacity 0)
      setImage2(newImage);
      // Preload the image, then trigger the fade
      preloadImage(newImage.shotUrl).then(() => {
        setActiveImage(2);
        isSwitching.current = false;
      });
    } else {
      const filteredCovers = covers.filter((cover) => cover !== currentImage2);
      const newImage =
        filteredCovers[Math.floor(Math.random() * filteredCovers.length)];
      // First set the new image in the hidden slot (opacity 0)
      setImage1(newImage);
      // Preload the image, then trigger the fade
      preloadImage(newImage.shotUrl).then(() => {
        setActiveImage(1);
        isSwitching.current = false;
      });
    }
  }).current;

  useEffect(() => {
    if (!renderInitialized.current) {
      const initialImage1 = covers[Math.floor(Math.random() * covers.length)];
      let initialImage2 = covers[Math.floor(Math.random() * covers.length)];
      // Make sure we start with two different images
      while (initialImage2 === initialImage1 && covers.length > 1) {
        initialImage2 = covers[Math.floor(Math.random() * covers.length)];
      }
      setImage1(initialImage1);
      setImage2(initialImage2);
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
    const numberOfPastCovers: number = 3;
    const delay = firstCover
      ? changeCoversEveryMs
      : (year - 2020) * changeCoversEveryMs;
    const timeoutId = setTimeout(() => {
      switchImage();
      startSwitchCoverInterval(
        (firstCover ? 1 : numberOfPastCovers) * changeCoversEveryMs
      );
    }, delay);

    return () => {
      clearTimeout(timeoutId);
      if (switchCoverIntervalRef.current) {
        clearInterval(switchCoverIntervalRef.current); // Clear the interval on cleanup
        switchCoverIntervalRef.current = null;
      }
    };
  }, [year, firstCover]);

  if (
    (activeImage === 1 && image1 === null) ||
    (activeImage === 2 && image2 === null)
  ) {
    return null;
  }

  function imageElement(imageURL: string | undefined, shouldDisplay: boolean) {
    if (!imageURL) return null;
    return (
      <div
        className="shot-wrapper"
        style={{
          ...coverImageStyle,
          position: "absolute",
          opacity: shouldDisplay ? 1 : 0,
          transition: "opacity 0.7s ease-in-out",
        }}
      >
        <img
          src={`${basePath}/${imageURL}`}
          loading="lazy"
          style={coverImageStyle}
        />
      </div>
    );
  }

  return (
    <a
      className="year-cover-container"
      href={`${basePath}/${year.toString()}`}
      style={getCoverContainerStyle()}
    >
      {imageElement(image1?.shotUrl, activeImage === 1)}
      {imageElement(image2?.shotUrl, activeImage === 2)}
      <div className="year-cover-frame" style={coverFrameStyle}></div>
      <h1
        className="text cover-framed-text font-galanogrotesque"
        style={framedTextStyle}
      >
        FRAMED
      </h1>
      <h2 className="cover-year-text" style={yearTextStyle}>
        {year}
      </h2>
    </a>
  );
}
