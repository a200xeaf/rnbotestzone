import React, {ChangeEvent} from 'react'
import {Handle, Position} from "@xyflow/react";
import {useDataNodeStore} from "../store.ts";
import {useShallow} from "zustand/react/shallow";
import {mainemitter} from "../eventbus/eventbus.ts";

interface StringProps {
    id: string
    data: {
        string_string: string
    }
}

const StringNode: React.FC<StringProps> = ({id, data}) => {
    const updateNode = useDataNodeStore(useShallow((state) => state.updateNode))

    const handleString = (e: ChangeEvent<HTMLInputElement>) => {
        updateNode(id, {string_string: e.target.value})
        mainemitter.emit(id + ":" + "string_string", e.target.value)
    }

    return (
        <div className='w-52 h-20 flex flex-col shadow-xl'>
            <div className='flex w-full h-[2rem] bg-green-400 items-center'>
                <span className='text-white font-bold px-2'>String</span>
            </div>
            <div className='flex flex-col w-full px-2 h-[3rem] bg-white justify-center items-center'>
                <input value={data.string_string} onChange={handleString} type='text' className='bg-gray-200 w-40' />
            </div>
            <Handle type='source' position={Position.Bottom} id='data-string_string'/>
        </div>
    )
}
export default StringNode
