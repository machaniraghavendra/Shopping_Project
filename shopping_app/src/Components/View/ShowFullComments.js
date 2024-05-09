import { useState } from "react";

export default function ShowFullComments(comment) {
    let sentence = comment.comment;

    const [showFullLength, setShowFullLength] = useState(false);

    const minLetters = 30

    const viewMoreToggle = () => {
        setShowFullLength(!showFullLength)
    }

    const loadsentence = () => {
        if (sentence!=null && sentence.length > 0) {
            if (showFullLength) {
                return sentence;
            } else {
                return sentence.slice(0, minLetters)
            }
        }
    }

    return (
        <span onClick={() => { viewMoreToggle() }}>
            <span >{loadsentence()}
                <span className="text-info" style={{ cursor: "pointer" }} onClick={() => { viewMoreToggle() }}>{(sentence!=null&&sentence.length > minLetters) ? !showFullLength ? " ...view more" : <span className="mx-1">&nbsp;-view less</span> : ""}</span>
            </span>
        </span>
    )
}