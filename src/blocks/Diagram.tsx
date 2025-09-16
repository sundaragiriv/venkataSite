import { ReactFlow, Background, Controls, MiniMap } from "@xyflow/react";
import "@xyflow/react/dist/style.css";

export default function Diagram({ nodes, edges }: any) {
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