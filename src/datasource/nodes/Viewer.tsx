import React from 'react'
import {Handle, Position, useHandleConnections} from "@xyflow/react";
import {useDataNodeStore} from "../store.ts";
import {useShallow} from "zustand/react/shallow";
import {useEmitterSubscriptions} from "../hooks/useEmitterSubscriptions.ts";

interface ViewerProps {
    id: string
    data: {
        viewer_value: never
    }
}

const Viewer: React.FC<ViewerProps> = ({id, data}) => {
    const connections = useHandleConnections({type: 'target', id: 'data'})
    const updateNode = useDataNodeStore(useShallow((state) => state.updateNode))

    const handleViewer = (e: unknown) => {
        updateNode(id, {viewer_value: e})
    }

    useEmitterSubscriptions({
        connections,
        callback: handleViewer,
        data
    })

    return (
        <div className='w-52 h-[6rem] flex flex-col shadow-xl'>
            <Handle type='target' position={Position.Top} id='data'/>
            <div className='flex w-full h-[2rem] bg-red-400 items-center'>
                <span className='text-white font-bold px-2'>Viewer</span>
            </div>
            <div className='flex flex-col w-full h-[4rem] bg-white justify-center items-center px-2'>
                <div
                    className='w-full overflow-x-auto whitespace-nowrap'
                    style={{maxHeight: '3rem', overflowY: 'hidden'}}
                >
                    <p>Value: {data.viewer_value}</p>
                </div>
                <p className='text-xs'>ID: {id}</p>
            </div>
        </div>
    )
}
export default Viewer
