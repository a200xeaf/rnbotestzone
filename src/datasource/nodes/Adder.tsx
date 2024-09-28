import {Handle, Position, useHandleConnections} from "@xyflow/react";
import React, {ChangeEvent} from "react";
import {useDataNodeStore} from "../store.ts";
import {useShallow} from "zustand/react/shallow";
import {mainemitter} from "../eventbus/eventbus.ts";
import {useEmitterSubscriptions} from "../hooks/useEmitterSubscriptions.ts";

interface AdderProps {
    id: string
    data: {
        adder_number: number
    }
}

const Adder: React.FC<AdderProps> = ({id, data}) => {
    const connections = useHandleConnections({type: 'target', id: 'data'})
    const updateNode = useDataNodeStore(useShallow((state) => state.updateNode))

    const handleAdder = (e: ChangeEvent<HTMLInputElement>) => {
        updateNode(id, {adder_number: e.target.valueAsNumber})
    }

    const handleAddition = (e: unknown) => {
        if (typeof e === 'number') {
            const total = e + data.adder_number;
            mainemitter.emit(id + ":" + "adder_result", total);
        } else {
            // Handle other types or invalid data here
            console.warn("Expected a number, but got:", e);
        }
    }

    useEmitterSubscriptions({
        connections,
        callback: handleAddition,
        data
    })

    return (
        <div className='w-52 h-20 flex flex-col shadow-xl'>
            <Handle type='target' position={Position.Top} id='data'/>
            <div className='flex w-full h-[2rem] bg-yellow-400 items-center'>
                <span className='text-white font-bold px-2'>Adder</span>
            </div>
            <div className='flex flex-col w-full h-[3rem] bg-white justify-center items-center'>
                <div className='flex'>
                    <span>+</span>
                    <input
                        type='number'
                        step={1}
                        className='bg-gray-200 w-20'
                        value={data.adder_number}
                        onChange={handleAdder}
                    />
                </div>
            </div>
            <Handle type='source' position={Position.Bottom} id='data-adder_result'/>
        </div>
    )
}
export default Adder
