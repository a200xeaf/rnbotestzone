import {toggleAudio, context, poly, changeValue2} from "../audio.ts";
import {ChangeEvent, useEffect, useState} from "react";
import {Input, WebMidi, NoteMessageEvent} from "webmidi";
import {MIDIEvent} from "@rnbo/js";
import MidiKeyboard from "./MidiKeyboard.tsx";

const MidiTest = () => {
    const [gainAmt, setGainAmt] = useState(1.0);
    const [gain2Amt, setGain2Amt] = useState(1.0);
    const [inputNames, setInputNames] = useState<string[]>([]);
    const [selectedInputName, setSelectedInputName] = useState<string | null>(null);
    const [midiInput, setMidiInput] = useState<Input | null>(null);

    const handleGainChange = (e: ChangeEvent<HTMLInputElement>) => {
        setGainAmt(e.target.valueAsNumber);
        changeValue2('gain', 'gain', e.target.valueAsNumber)
    }

    const handleGain2Change = (e: ChangeEvent<HTMLInputElement>) => {
        setGain2Amt(e.target.valueAsNumber);
        changeValue2('gain', 'gain2', e.target.valueAsNumber)
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
        <div className='p-5 flex flex-col gap-y-4'>
            <p>Hello</p>
            <button className='p-2 bg-gray-200 drop-shadow-lg' onClick={toggleAudio}>Start</button>
            <input value={gainAmt} onChange={handleGainChange} min={0} max={1} step={0.01} type='range'/>
            <input value={gain2Amt} onChange={handleGain2Change} min={0} max={1} step={0.01} type='range'/>
            <button onClick={handleMidi}>Check midi</button>
            <select onChange={handleSelectionChange}>
                {inputNames.length > 0 && <option value="">None</option>}
                {inputNames.length > 0 ? (
                    inputNames.map((input, index) => (
                        <option key={index} value={input}>{input}</option>
                    ))) : <option value={""}>No Midi Inputs Detected</option>
                }
            </select>
            <MidiKeyboard />
        </div>
    )
}
export default MidiTest
