import {Background, BackgroundVariant, ReactFlow} from "@xyflow/react";
import {useDataNodeStore} from "./store.ts";
import {useShallow} from "zustand/react/shallow";
import NumberNode from './nodes/NumberNode.tsx'
import ViewerNode from './nodes/Viewer.tsx'
import StringNode from "./nodes/String.tsx";
import AdderNode from "./nodes/Adder.tsx";

const nodeTypes = {
    numberNode: NumberNode,
    viewerNode: ViewerNode,
    stringNode: StringNode,
    adderNode: AdderNode,
}

const DataTest = () => {
    const nodes = useDataNodeStore(useShallow((state) => state.nodes))
    const edges = useDataNodeStore(useShallow((state) => state.edges))

    const onConnect = useDataNodeStore(useShallow((state) => state.onConnect))

    const onNodesChange = useDataNodeStore(useShallow((state) => state.onNodesChange))
    const onNodesDelete = useDataNodeStore(useShallow((state) => state.onNodesDelete))

    const onEdgesChange = useDataNodeStore(useShallow((state) => state.onEdgesChange))
    const onEdgesDelete = useDataNodeStore(useShallow((state) => state.onEdgesDelete))

    const createNode = useDataNodeStore(useShallow((state) => state.createNode))
    const isValidConnection = useDataNodeStore(useShallow((state) => state.isValidConnection))
    return (
        <div className='h-screen w-screen'>
            <div className='flex w-full absolute z-10'>
                <button className='p-2 bg-gray-200 rounded-xl mx-2' onClick={() => createNode("numberNode")}>
                    Number Node
                </button>
                <button className='p-2 bg-gray-200 rounded-xl mx-2' onClick={() => createNode("stringNode")}>
                    String Node
                </button>
                <button className='p-2 bg-gray-200 rounded-xl mx-2' onClick={() => createNode("adderNode")}>
                    Adder Node
                </button>
                <button className='p-2 bg-gray-200 rounded-xl mx-2' onClick={() => createNode("viewerNode")}>
                    Viewer Node
                </button>
            </div>

            <ReactFlow
                nodes={nodes}
                edges={edges}

                onConnect={onConnect}
                isValidConnection={isValidConnection}

                onNodesChange={onNodesChange}
                onNodesDelete={onNodesDelete}

                onEdgesChange={onEdgesChange}
                onEdgesDelete={onEdgesDelete}

                nodeTypes={nodeTypes}
            >
                <Background
                    variant={BackgroundVariant.Lines}
                />
            </ReactFlow>
        </div>
    )
}
export default DataTest
