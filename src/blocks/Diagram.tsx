import { ReactFlow, Background, Controls, MiniMap, type Node, type Edge } from "@xyflow/react";
import "@xyflow/react/dist/style.css";

interface DiagramProps {
  nodes: Node[];
  edges: Edge[];
}

export default function Diagram({ nodes, edges }: DiagramProps) {
  return (
    <div className="h-[420px] rounded-xl border border-black/10 bg-white">
      <ReactFlow nodes={nodes} edges={edges} fitView>
        <Background />
        <Controls />
        <MiniMap />
      </ReactFlow>
    </div>
  );
}