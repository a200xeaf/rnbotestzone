import {createDevice, Device, IPatcher} from "@rnbo/js";
import oscJson from './nodesource/osc/osc.export.json'
import gainJson from './nodesource/gain/gain.export.json'
import polyJson from './nodesource/poly/poly.export.json'

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
const gain = await createDevice({context, patcher: patcherGain})

const devices = new Map<string, Device>()
devices.set('poly', poly)
devices.set('gain', gain)

poly.node.connect(gain.node)
gain.node.connect(context.destination)

// Generalized function to change the parameter value of any device
export const changeValue = (deviceName: string, paramName: string, value: number) => {
    const device = devices.get(deviceName);

    if (!device) {
        console.error(`Device ${deviceName} not found`);
        return;
    }

    // Find the parameter by name
    const param = device.parameters.find(p => p.name === paramName);

    if (param) {
        param.value = value;
        console.log(`Updated ${paramName} to ${value} on ${deviceName}`);
    } else {
        console.error(`Parameter ${paramName} not found on device ${deviceName}`);
    }
};

