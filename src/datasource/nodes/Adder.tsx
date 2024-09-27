import {Handle, Position, useHandleConnections} from "@xyflow/react";
import React, {ChangeEvent, useEffect} from "react";
import {useDataNodeStore} from "../store.ts";
import {useShallow} from "zustand/react/shallow";
import {mainemitter} from "../eventbus/eventbus.ts";

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
        updateNode(id, {adder_number: e.target.value})
    }

    const handleAddition = (e) => {
        const total = Number(e) + Number(data.adder_number)
        mainemitter.emit(id + ":" + "adder_result", total)
    }

    useEffect(() => {
        console.log("update")
        const activeSubscriptions: (() => void)[] = []

        const subscribeToEmitter = (emitterName: string) => {
            mainemitter.on(emitterName, handleAddition)

            return () => mainemitter.off(emitterName, handleAddition)
        }

        connections.forEach(({source, sourceHandle}) => {
            const emitterName = `${source}:${sourceHandle?.replace('data-', '')}`
            const unsubscribe = subscribeToEmitter(emitterName)
            activeSubscriptions.push(unsubscribe)
        })

        return () => (
            activeSubscriptions.forEach((unsubscribe) => unsubscribe())
        )
    }, [connections, data]);

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
