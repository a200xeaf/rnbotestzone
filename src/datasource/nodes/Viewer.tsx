import React, {useEffect} from 'react'
import {Handle, Position, useHandleConnections} from "@xyflow/react";
import {useDataNodeStore} from "../store.ts";
import {useShallow} from "zustand/react/shallow";
import {mainemitter} from "../eventbus/eventbus.ts";

interface ViewerProps {
    id: string
    data: {
        viewer_value: never
    }
}

const Viewer: React.FC<ViewerProps> = ({id, data}) => {
    const connections = useHandleConnections({type: 'target', id: 'data'})
    const updateNode = useDataNodeStore(useShallow((state) => state.updateNode))

    const handleViewer = (e) => {
        updateNode(id, {viewer_value: e})
    }

    useEffect(() => {
        const activeSubscriptions: (() => void)[] = []

        const subscribeToEmitter = (emitterName: string) => {
            mainemitter.on(emitterName, handleViewer)

            return () => mainemitter.off(emitterName, handleViewer)
        }

        connections.forEach(({source, sourceHandle}) => {
            const emitterName = `${source}:${sourceHandle?.replace('data-', '')}`
            const unsubscribe = subscribeToEmitter(emitterName)
            activeSubscriptions.push(unsubscribe)
        })

        return () => (
            activeSubscriptions.forEach((unsubscribe) => unsubscribe())
        )
    }, [connections]);

    return (
        <div className='w-52 h-20 flex flex-col shadow-xl'>
            <Handle type='target' position={Position.Top} id='data'/>
            <div className='flex w-full h-[2rem] bg-red-400 items-center'>
                <span className='text-white font-bold px-2'>Viewer</span>
            </div>
            <div className='flex flex-col w-full h-[3rem] bg-white justify-center items-center'>
                <p>Value: {data.viewer_value}</p>
                <p className='text-xs'>ID: {id}</p>
            </div>
        </div>
    )
}
export default Viewer
