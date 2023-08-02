import React, { useEffect, useState } from "react";

export default function Testing(){
    const [mouseX, setMouseX] = useState(0);
    const [mouseY, setMouseY] = useState(0);
    const [catchClick, setCatchClick] = useState("false");
    
    const [coodsOne, setCoodsOne] = useState([500, 500]);
    const [coodsTwo, setCoodsTwo] = useState([500, 1000]);
    const [coodsThree, setCoodsThree] = useState([1000, 500]);
    const [coodsFour, setCoodsFour] = useState([1000, 1000]);

    useEffect(() => {
        const handleWindowMouseMove = (event) => {
            setMouseX(prev => event.screenX);
            setMouseY(prev => event.screenY);
        };

        window.addEventListener('mousemove', handleWindowMouseMove);
    
        return () => {
            window.removeEventListener('mousemove', handleWindowMouseMove);
            //window.removeEventListener('mousedown', handleCatchClick);
        };
    }, []);

    const handleCatchClick = () => {
        console.log("event fired");
        console.log(mouseX, mouseY);
        console.log(coodsOne[0]);
        if(mouseX >= coodsOne[0] && mouseX >= coodsTwo[0] && mouseX <= coodsThree[0] && mouseX <= coodsFour[0]){
            if(mouseY >= coodsOne[1] && mouseY >= coodsTwo[1] && mouseY >= coodsThree[1] && mouseY <= coodsFour[1]){
                console.log("came till here");
                setCatchClick("true");
            }
        }
    };

    return(
        <div onClick = {handleCatchClick}
            style = {{ backgroundColor: "red", height: window.innerHeight, width: window.innerWidth }}
        >
            {mouseX} {mouseY} {catchClick}
        </div>
    );
}