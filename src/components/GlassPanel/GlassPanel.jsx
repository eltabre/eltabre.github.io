import React from "react";

import "./GlassPanel.css"


function GlassPanel({title, text, imageSrc, altColor}) {
    return(
        <div className="glassPanel">
            <h2>{title}</h2>
            <p>{text}</p>
        </div>
    );
}

export default GlassPanel; 