import { ReactFlow, Background, Controls, MiniMap, type Node, type Edge } from "@xyflow/react";
import "@xyflow/react/dist/style.css";

interface DiagramProps {
  data: {
    nodes: Node[];
    edges: Edge[];
  };
}

export default function Diagram({ data }: DiagramProps) {
  return (
    <div className="h-[420px]">
      <ReactFlow nodes={data.nodes} edges={data.edges} fitView>
        <Background />
        <Controls />
        <MiniMap />
      </ReactFlow>
    </div>
  );
}