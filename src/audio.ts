import {createDevice, Device, IPatcher, WorkletDevice} from "@rnbo/js";
import oscJson from './nodesource/osc/osc.export.json'
import gainJson from './nodesource/gain/gain.export.json'
import polyJson from './nodesource/poly/poly.export.json'
import {createFaustNode} from "./nodesource/createFaustNode.ts";
import {FaustMonoAudioWorkletNode} from "@grame/faustwasm";

export const context = new AudioContext();
// @ts-expect-error rainbow issue
const patcherOsc: IPatcher = oscJson;
// @ts-expect-error rainbow issue
const patcherGain: IPatcher = gainJson;
// @ts-expect-error rainbow issue
const patcherPoly: IPatcher = polyJson;

export const toggleAudio = async() => {
    if (context.state === 'running') {
        await context.suspend()
        console.log("stopped")
    } else {
        await context.resume()
        console.log("started")
    }
}

export const poly = await createDevice({context, patcher: patcherPoly})
const gain2 = await createDevice({context, patcher: patcherGain})

const devices = new Map<string, Device | FaustMonoAudioWorkletNode | undefined | null>()
// devices.set('poly', poly)
devices.set('gain2', gain2)

try {
    const noise = await createFaustNode("noise", context, "noise", 0)
    const gain = await createFaustNode("gain", context, "gain", 0)
    devices.set('noise', noise.faustNode)
    devices.set('gain', gain.faustNode)
    noise.faustNode.connect(gain.faustNode)
    gain.faustNode.connect(context.destination)
    console.log(noise.faustNode.parameters)
    console.log(noise.faustNode.getParams())
    gain.faustNode.parameters.forEach((param) => console.log(param))
    console.log(gain.faustNode.getParams())
} catch (e) {
    console.error("Failed to make FaustNode: ", e)
}

// Generalized function to change the parameter value of any device
export const changeValue2 = (deviceName: string, paramName: string, value: number) => {
    const device = devices.get(deviceName);

    if (device instanceof FaustMonoAudioWorkletNode) {
        console.log("Device is a FaustMonoAudioWorkletNode.");
    } else if (device instanceof WorkletDevice) {
        console.log("Device is a WorkletDevice.");
    } else {
        console.log("Device is of an unknown type.");
    }
};

