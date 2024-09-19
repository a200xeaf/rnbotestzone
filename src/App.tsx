import {changeValue, toggleAudio} from "./audio.ts";
import {ChangeEvent, useState} from "react";

const App = () => {
    const [oscFreq, setOscFreq] = useState(440);
    const [gainAmt, setGainAmt] = useState(1.0);
    const [gainAmt2, setGainAmt2] = useState(1.0);

    const handleOscChange = (e: ChangeEvent<HTMLInputElement>) => {
        setOscFreq(e.target.valueAsNumber);
        changeValue('osc', 'frequency', e.target.valueAsNumber)
    }

    const handleGainChange = (e: ChangeEvent<HTMLInputElement>) => {
        setGainAmt(e.target.valueAsNumber);
        changeValue('gain', 'gain', e.target.valueAsNumber)
    }

    const handleGainChange2 = (e: ChangeEvent<HTMLInputElement>) => {
        setGainAmt2(e.target.valueAsNumber);
        changeValue('gain', 'gain2', e.target.valueAsNumber)
    }


    return (
        <div className='p-5'>
            <p>Hello</p>
            <button className='p-2 bg-gray-200 drop-shadow-lg' onClick={toggleAudio}>Start</button>
            <input value={oscFreq} onChange={handleOscChange} min={20} max={1000} type='range'/>
            <input value={gainAmt} onChange={handleGainChange} min={0} max={1} step={0.01} type='range'/>
            <input value={gainAmt2} onChange={handleGainChange2} min={0} max={1} step={0.01} type='range'/>
        </div>
    )
}
export default App
