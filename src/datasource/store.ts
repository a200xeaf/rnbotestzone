import {create} from 'zustand'
import {
    applyEdgeChanges,
    applyNodeChanges,
    Edge, getOutgoers,
    Node as FlowNode, OnConnect,
    OnEdgesChange, OnEdgesDelete,
    OnNodesChange, OnNodesDelete,
    IsValidConnection
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
    isValidConnection: IsValidConnection

    createNode: (nodeName: string) => void


}

export const useDataNodeStore = create<DataNodeState>((set, get) => ({
    nodes: [
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
    },
    createNode: (type) => {
        let id: string
        switch (type) {
            case 'numberNode': {
                id = nanoid()
                const data = {number_number: 0};
                const position = {x: 0, y: 0};
                set({nodes: [...get().nodes, {id, position, data, type}]})
                break
            }
            case 'viewerNode': {
                id = nanoid()
                const data = {viewer_value: null};
                const position = {x: 0, y: 0};
                set({nodes: [...get().nodes, {id, position, data, type}]})
                break
            }
            case 'stringNode': {
                id = nanoid()
                const data = {string_string: "hello"};
                const position = {x: 0, y: 0};
                set({nodes: [...get().nodes, {id, position, data, type}]})
                break
            }
            case 'adderNode': {
                id = nanoid()
                const data = {adder_number: 0};
                const position = {x: 0, y: 0};
                set({nodes: [...get().nodes, {id, position, data, type}]})
                break
            }
        }
    },
    isValidConnection: (connection) => {
        const nodes = get().nodes
        const edges = get().edges
        const target = nodes.find((node) => node.id === connection.target)

        // Check if target is undefined
        if (!target) {
            return false
        }

        const hasCycle = (node: FlowNode, visited = new Set()): boolean => {
            if (visited.has(node.id)) return false

            visited.add(node.id)

            for (const outgoer of getOutgoers(node, nodes, edges)) {
                if (outgoer.id === connection.source) return true
                if (hasCycle(outgoer, visited)) return true
            }

            return false
        };

        if (target.id === connection.source) return false

        return !hasCycle(target)
    }
}))