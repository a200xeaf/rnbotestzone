import React, {ChangeEvent} from 'react'
import {Handle, Position} from "@xyflow/react";
import {useDataNodeStore} from "../store.ts";
import {useShallow} from "zustand/react/shallow";
import {mainemitter} from "../eventbus/eventbus.ts";

interface NumberProps {
    id: string
    data: {
        number_number: number
    }
}

const NumberNode: React.FC<NumberProps> = ({id, data}) => {
    const updateNode = useDataNodeStore(useShallow((state) => state.updateNode))

    const handleNumber = (e: ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value;

        // If the input is cleared, set the value to 0
        if (value === "") {
            updateNode(id, { number_number: 0 });
            mainemitter.emit(id + ":" + "number_number", 0);
            return;
        }

        value = value.replace(/^0+/, "") || "0"; // Fallback to "0" if all zeros are removed
        console.log(value)

        let finalNumber = Number(value)
        updateNode(id, { number_number: finalNumber });
        mainemitter.emit(id + ":" + "number_number", finalNumber);
    };

    return (
        <div className='w-52 h-20 flex flex-col shadow-xl'>
            <div className='flex w-full h-[2rem] bg-blue-400 items-center'>
                <span className='text-white font-bold px-2'>Number</span>
            </div>
            <div className='flex w-full h-[3rem] bg-white justify-center items-center'>
                <input
                    type='number'
                    min={0}
                    max={100}
                    step={1}
                    value={Number(data.number_number).toString()}
                    onChange={handleNumber}
                    className='bg-gray-200 h-6'
                />
            </div>
            <Handle type='source' position={Position.Bottom} id='data-number_number'/>
        </div>
    )
}
export default NumberNode
