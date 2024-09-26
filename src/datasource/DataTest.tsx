import {Background, BackgroundVariant, ReactFlow} from "@xyflow/react";
import {useDataNodeStore} from "./store.ts";
import {useShallow} from "zustand/react/shallow";
import NumberNode from './nodes/Number.tsx'
import ViewerNode from './nodes/Viewer.tsx'
import StringNode from "./nodes/String.tsx";

const nodeTypes = {
    numberNode: NumberNode,
    viewerNode: ViewerNode,
    stringNode: StringNode,
}

const DataTest = () => {
    const nodes = useDataNodeStore(useShallow((state) => state.nodes))
    const edges = useDataNodeStore(useShallow((state) => state.edges))

    const onConnect = useDataNodeStore(useShallow((state) => state.onConnect))

    const onNodesChange = useDataNodeStore(useShallow((state) => state.onNodesChange))
    const onNodesDelete = useDataNodeStore(useShallow((state) => state.onNodesDelete))

    const onEdgesChange = useDataNodeStore(useShallow((state) => state.onEdgesChange))
    const onEdgesDelete = useDataNodeStore(useShallow((state) => state.onEdgesDelete))
    return (
        <div className='h-screen w-screen'>

            <ReactFlow
                nodes={nodes}
                edges={edges}

                onConnect={onConnect}

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
