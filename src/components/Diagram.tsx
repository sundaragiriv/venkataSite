import { ReactFlow, Background, Controls, MiniMap } from "@xyflow/react";
import "@xyflow/react/dist/style.css";

export default function Diagram({ data }: { data: { nodes: any[]; edges: any[] } }) {
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