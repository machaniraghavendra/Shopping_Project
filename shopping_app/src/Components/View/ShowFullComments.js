import { useState } from "react";

export default function ShowFullComments(comment) {
    let sentence = comment.comment;

    const [showFullLength, setShowFullLength] = useState(false);
    
    const minLetters = 45

    const viewMoreToggle = () => {
        setShowFullLength(!showFullLength)
    }

    const loadsentence = () => {
        if (showFullLength) {
            return sentence;
        } else {
            return sentence.slice(0, minLetters)
        }
    }

    return (
        <span>
            {sentence.length > minLetters ? "" : ""}
            <span>{loadsentence()}
                <span className="text-info" style={{ cursor: "pointer" }} onClick={() => { viewMoreToggle() }}>{sentence.length > minLetters ? !showFullLength ? " ...view more" : <span className="mx-1">&nbsp;-view less</span> : ""}</span>
            </span>
        </span>
    )
}