import {create} from 'zustand'
import {
    applyEdgeChanges,
    applyNodeChanges,
    Edge,
    Node as FlowNode, OnConnect,
    OnEdgesChange, OnEdgesDelete,
    OnNodesChange, OnNodesDelete
} from '@xyflow/react'
import {nanoid} from "nanoid";

export interface DataNodeState {
    nodes: FlowNode[]
    edges: Edge[]

    onConnect: OnConnect

    onNodesChange: OnNodesChange
    onEdgesChange: OnEdgesChange
    onNodesDelete: OnNodesDelete
    onEdgesDelete: OnEdgesDelete

    updateNode: (id: string, data: Partial<FlowNode['data']>) => void


}

export const useDataNodeStore = create<DataNodeState>((set, get) => ({
    nodes: [
        { id: '1', position: { x: 0, y: 0 }, data: { number_number: '1' }, type: 'numberNode' },
        { id: '4', position: { x: 0, y: 0 }, data: { number_number: '1' }, type: 'numberNode' },
        { id: '5', position: { x: 0, y: 0 }, data: { string_string: 'hello' }, type: 'stringNode' },
        { id: '2', position: { x: 0, y: 100 }, data: { viewer_value: null }, type: 'viewerNode' },
    ],
    edges: [],

    onNodesChange: (changes) => {
        set({
            nodes: applyNodeChanges(changes, get().nodes)
        })
    },
    onEdgesChange: (changes) => {
        set({
            edges: applyEdgeChanges(changes, get().edges)
        })
    },
    onConnect: (edge) => {
        const id = nanoid(6)
        const newEdge = {id, ...edge}
        set({edges: [newEdge, ...get().edges]})
    },
    updateNode: (id, data) => {
        set({
            nodes: get().nodes.map((node) =>
                node.id === id
                    ? {...node, data: {...node.data, ...data}}
                    : node
            ),
        });
    },
    onNodesDelete: (nodes) => {
        for (const {id} of nodes) {
            console.log(id)
        }
    },
    onEdgesDelete: (edges) => {
        for (const edge of edges) {
            console.log(edge.id)
        }
    }
}))