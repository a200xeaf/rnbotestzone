import React, { useState } from "react";
import Knob1 from "./Knob1.tsx";
import Numbox1 from "./Numbox1.tsx";

const App: React.FC = () => {
    const [value, setValue] = useState(50);
    const [valueNumbox, setValueNumbox] = useState(50);

    const handleCallback = (id: string, newValue: number) => {
        console.log(id, "changed to", newValue);
        setValue(newValue);
    };

    const handleNumbox = (id: string, newValue: number) => {
        console.log(id, "changed to", newValue);
        setValueNumbox(newValue);
    };

    return (
        <div>
            <Knob1
                id="main1"
                value={value}
                min_value={0}
                max_value={1000}
                default_value={20}
                callback={handleCallback}
            />
            <p>Current Value: {value.toFixed(2)}</p>
            <Numbox1 id="spang" value={valueNumbox} min_value={-10000} max_value={10000} default_value={50} callback={handleNumbox} />
        </div>
    );
};

export default App;