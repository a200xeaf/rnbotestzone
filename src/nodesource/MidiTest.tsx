import {changeValue, toggleAudio, context, poly} from "../audio.ts";
import {ChangeEvent, useEffect, useState} from "react";
import {Input, WebMidi, NoteMessageEvent} from "webmidi";
import {MIDIEvent} from "@rnbo/js";

const MidiTest = () => {
    const [gainAmt, setGainAmt] = useState(1.0);
    const [gainAmt2, setGainAmt2] = useState(1.0);
    const [attack, setAttack] = useState(100.0);
    const [decay, setDecay] = useState(100.0);
    const [sustain, setSustain] = useState(0.6);
    const [release, setRelease] = useState(100.0);
    const [inputNames, setInputNames] = useState<string[]>([]);
    const [selectedInputName, setSelectedInputName] = useState<string | null>(null);
    const [midiInput, setMidiInput] = useState<Input | null>(null);

    const handleGainChange = (e: ChangeEvent<HTMLInputElement>) => {
        setGainAmt(e.target.valueAsNumber);
        changeValue('gain', 'gain', e.target.valueAsNumber)
    }

    const handleGainChange2 = (e: ChangeEvent<HTMLInputElement>) => {
        setGainAmt2(e.target.valueAsNumber);
        changeValue('gain', 'gain2', e.target.valueAsNumber)
    }

    const handleADSRChange = (e: ChangeEvent<HTMLInputElement>) => {
        switch (e.target.id) {
            case "attack":
                setAttack(e.target.valueAsNumber);
                changeValue('poly', 'poly_attack', e.target.valueAsNumber)
                break
            case "decay":
                setDecay(e.target.valueAsNumber);
                changeValue('poly', 'poly_decay', e.target.valueAsNumber)
                break
            case "sustain":
                setSustain(e.target.valueAsNumber);
                changeValue('poly', 'poly_sustain', e.target.valueAsNumber)
                break
            case "release":
                setRelease(e.target.valueAsNumber);
                changeValue('poly', 'poly_release', e.target.valueAsNumber)
                break
        }

    }

    const handleMidi = async () => {
        try {
            await WebMidi.enable()
            const inputs = WebMidi.inputs
            const inputNames: string[] = []
            inputs.forEach(input => (
                inputNames.push(input.name)
            ))
            console.log(inputNames)
            setInputNames(inputNames)
        } catch (e) {
            console.log("failed to get midi ", e)
        }

    }
    
    // Handle adding/removing MIDI listeners
    useEffect(() => {
        if (selectedInputName === "" || selectedInputName === null) {
            // No input selected, remove any existing listeners and reset state
            if (midiInput) {
                midiInput.removeListener();
                setMidiInput(null);
            }
            return;
        }

        const selectedInput = WebMidi.getInputByName(selectedInputName);

        if (selectedInput) {
            // Set the new MIDI input and add listeners for "noteon" and "noteoff"
            setMidiInput(selectedInput);

            // @ts-expect-error shutup
            selectedInput.addListener("noteon", "all", (e: NoteMessageEvent) => {
                console.log(e)
                // console.log("Note On:", e.note.number); // Logs the MIDI note number for note on events
                const midiInfo = e.data
                // @ts-expect-error shutup
                const noteOnEvent = new MIDIEvent(context.currentTime, 0, midiInfo)
                poly.scheduleEvent(noteOnEvent)
            });

            // @ts-expect-error shutup
            selectedInput.addListener("noteoff", "all", (e: NoteMessageEvent) => {
                console.log(e)
                // console.log("Note Off:", e.note.number); // Logs the MIDI note number for note off events
                const midiInfo = e.data
                // @ts-expect-error shutup
                const noteOffEvent = new MIDIEvent(context.currentTime, 0, midiInfo)
                poly.scheduleEvent(noteOffEvent)
            });
        }

        // Cleanup: remove listener when the component unmounts or input changes
        return () => {
            if (midiInput) {
                midiInput.removeListener();
            }
        };
    }, [selectedInputName, midiInput]);

    const handleSelectionChange = (e: ChangeEvent<HTMLSelectElement>) => {
        setSelectedInputName(e.target.value);
    };

    return (
        <div className='p-5 flex'>
            <p>Hello</p>
            <button className='p-2 bg-gray-200 drop-shadow-lg' onClick={toggleAudio}>Start</button>
            <input value={gainAmt} onChange={handleGainChange} min={0} max={1} step={0.01} type='range'/>
            <input value={gainAmt2} onChange={handleGainChange2} min={0} max={1} step={0.01} type='range'/>
            <div className='flex flex-col'>
                <input id='attack' value={attack} onChange={handleADSRChange} min={1} max={1000} step={0.01} type='range'/>
                <input id='decay' value={decay} onChange={handleADSRChange} min={1} max={1000} step={0.01} type='range'/>
                <input id='sustain' value={sustain} onChange={handleADSRChange} min={0} max={1} step={0.01} type='range'/>
                <input id='release' value={release} onChange={handleADSRChange} min={1} max={10000} step={0.01} type='range'/>
            </div>
            <button onClick={handleMidi}>Check midi</button>
            <select onChange={handleSelectionChange}>
                {inputNames.length > 0 && <option value="">None</option>}
                {inputNames.length > 0 ? (
                    inputNames.map((input, index) => (
                        <option key={index} value={input}>{input}</option>
                    ))) : <option value={""}>No Midi Inputs Detected</option>
                }
            </select>
        </div>
    )
}
export default MidiTest
