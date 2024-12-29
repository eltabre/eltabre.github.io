import "./GlassPanel.css"

function GlassPanel({title, text, imagesrc}) {
    return(
        <div className="glassPanelContainer">
            {imagesrc && (
                <img src={imagesrc} alt="background" className="glassPanelBackground" />
            )}
            <div className="glassPanel">
                <h2>{title}</h2>
                <p>{text}</p>
            </div>
        </div>

    );
}

export default GlassPanel; 