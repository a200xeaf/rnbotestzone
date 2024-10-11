import { useEffect, useState } from "react";
import {midiKeyMap, noteNames, octaveKeyMap, velocityKeyMap} from "./midiMaps.ts";

const MidiKeyboard = () => {
    const [pressedKeys, setPressedKeys] = useState(new Set<string>());
    const [lastKey, setLastKey] = useState<[number | undefined, number | undefined]>([undefined, undefined]);
    const [octave, setOctave] = useState<number>(0);
    const [velocity, setVelocity] = useState<number>(100);

    const midiNumberToNote = (midiNumber: number | undefined): string => {
        if (midiNumber === undefined) {
            return "Nothing"
        }
        const note = noteNames[midiNumber % 12]; // Get the note name (C, C#, etc.)
        const octave = Math.floor(midiNumber / 12) - 1; // Calculate the octave
        return `${note}${octave}`; // Return the note name with octave
    }

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!pressedKeys.has(e.key) && midiKeyMap.has(e.key)) {
                const midiNote = midiKeyMap.get(e.key)
                if (midiNote !== undefined) {
                    console.log("MIDI Note Pressed:", midiNote + octave, "at velocity", velocity)
                    setLastKey([midiNote + octave, velocity])
                    setPressedKeys((prev) => new Set(prev).add(e.key))
                }
            }
            if (octaveKeyMap.has(e.key)) {
                const octaveChange = octaveKeyMap.get(e.key)
                if (octaveChange !== undefined) {
                    const newOctave = Math.max(Math.min((octave + octaveChange), 48), -48)
                    console.log("Octave is now", newOctave)
                    setOctave(newOctave)
                }
            }
            if (velocityKeyMap.has(e.key)) {
                const velocityChange = velocityKeyMap.get(e.key)
                if (velocityChange !== undefined) {
                    let newVelocity: number
                    if (velocity === 127 && e.key === 'c') {
                        newVelocity = 120
                    } else {
                        newVelocity = Math.max(Math.min((velocity + velocityChange), 127), 0)
                    }
                    console.log("Velocity is now", newVelocity)
                    setVelocity(newVelocity)
                }
            }
        };

        const handleKeyUp = (e: KeyboardEvent) => {
            if (pressedKeys.has(e.key) && midiKeyMap.has(e.key)) {
                const midiNote = midiKeyMap.get(e.key)
                if (midiNote !== undefined) {
                    console.log("MIDI Note Released:", midiNote + octave);
                    setPressedKeys((prev) => {
                        const updatedKeys = new Set(prev);
                        updatedKeys.delete(e.key);
                        return updatedKeys;
                    });
                }
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        document.addEventListener("keyup", handleKeyUp);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            document.removeEventListener("keyup", handleKeyUp);
        };
    }, [pressedKeys, midiKeyMap, octave, velocity]);

    return (
        <>
            <div>MidiKeyboard</div>
            <p>Last key pressed: {midiNumberToNote(lastKey[0])} with velocity {lastKey[1] === undefined ? "nothing" : lastKey[1]}</p>
            <p>Octave: {octave >= 0 ? `+${octave / 12}` : `-${octave / 12}`}</p>
        </>
    );
};

export default MidiKeyboard;