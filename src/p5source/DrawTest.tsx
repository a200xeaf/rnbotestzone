import React, { useState } from "react";
import Knob1 from "./Knob1.tsx";
import Numbox1 from "./Numbox1.tsx";
import {panFormat} from "./numberFormats.ts";
import PianoKeyboard from "./PianoKeyboard.tsx";
import Slider1 from "./Slider1.tsx";

const App: React.FC = () => {
    const [value, setValue] = useState(1.2);
    const [valueNumbox, setValueNumbox] = useState(50);
    const [valueSlider, setValueSlider] = useState(100);

    const handleCallback = (id: string, newValue: number) => {
        console.log(id, "changed to", newValue);
        setValue(newValue);
    };

    const handleNumbox = (id: string, newValue: number) => {
        console.log(id, "changed to", newValue);
        setValueNumbox(newValue);
    };

    const handleSlider = (id: string, newValue: number) => {
        console.log(id, "changed to", newValue);
        setValueSlider(newValue);
    };

    return (
        <div>
            <Knob1
                id="main1"
                value={value}
                min_value={-200}
                max_value={200}
                default_value={0}
                callback={handleCallback}
            />
            <p>Current Value: {panFormat(value)}</p>
            <Numbox1 id="spang" value={valueNumbox} min_value={-10000} max_value={10000} default_value={50} callback={handleNumbox} />
            <PianoKeyboard />
            <Slider1 id='spangjob' value={valueSlider} min_value={0} max_value={10000} default_value={100} callback={handleSlider} orientation='vertical' filled={true} />
            <Slider1 id='spangjob' value={valueSlider} min_value={0} max_value={10000} default_value={100} callback={handleSlider} orientation='horizontal' filled={true} />
        </div>
    );
};

export default App;