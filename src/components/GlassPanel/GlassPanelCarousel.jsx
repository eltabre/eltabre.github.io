import React, { useState, useEffect } from "react";
import GlassPanel from "./GlassPanel";


import projectData from './projectinfo.json';
import "./GlassPanelCarousel.css";

function GlassPanelCarousel() {
    const [currentIndex, setCurrentIndex] = useState(0)

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % projectData.length);
        }, 20000)

        return () => clearInterval(interval);
    }, [])

    return(
        <div className="glassPanelCarousel">
            <GlassPanel
            title={projectData[currentIndex].title}
            text={projectData[currentIndex].text}
            imagesrc={projectData[currentIndex].imagesrc  || null}
            altColor={projectData[currentIndex].altColor}
            />
        </div>
    );
}

export default GlassPanelCarousel;