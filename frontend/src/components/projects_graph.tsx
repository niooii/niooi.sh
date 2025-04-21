import React, { useEffect, useRef, useState } from "react";
import { IParallax, ParallaxLayer } from "@react-spring/parallax";
import Project, { ProjectCategory } from "@/lib/project";

export interface ProjectGraphNode {
    data: Project | ProjectCategory;
    type: "proj" | "cat";
    xOffset: number;
    yOffset: number;
}

type NodePositions = Record<string, { x: number, y: number }>;

interface ProjectGraphProps {
    nodes: ProjectGraphNode[];
    parallaxRef: React.RefObject<IParallax>;
    canvasRef: React.RefObject<HTMLCanvasElement>;
}

const ProjectGraph: React.FC<ProjectGraphProps> = ({ nodes, parallaxRef, canvasRef }) => {
    const [nodePositions, setNodePositions] = useState<NodePositions>({});
    const [currentProjNode, setCurrentProjNode] = useState<Project>();
    const animationTimeRef = useRef<number>(0);
    
    const getNodeId = (node: ProjectGraphNode): string => 
        node.type === "proj" ? `project-${(node.data as Project).id}` : `category-${node.data as ProjectCategory}`;

    useEffect(() => {
        if (!parallaxRef.current || !canvasRef.current) return;
        
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        
        const updateCanvasSize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        
        updateCanvasSize();
        window.addEventListener('resize', updateCanvasSize);
        
        let animationFrame: number;
        let startTime = Date.now();
        
        const drawEdges = () => {
            animationTimeRef.current = (Date.now() - startTime) / 1000;
            
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Update node positions
            const newPositions: NodePositions = {};
            nodes.forEach(node => {
                const nodeId = getNodeId(node);
                const nodeEl = document.getElementById(nodeId);
                
                if (nodeEl) {
                    const rect = nodeEl.getBoundingClientRect();
                    newPositions[nodeId] = {
                        x: rect.left + rect.width / 2,
                        y: rect.top + rect.height / 2
                    };
                }
            });
            
            // store new positions
            setNodePositions(prev => {
                let hasChanges = false;
                for (const id in newPositions) {
                    if (!prev[id] || 
                        Math.abs(prev[id].x - newPositions[id].x) > 1 || 
                        Math.abs(prev[id].y - newPositions[id].y) > 1) {
                        hasChanges = true;
                        break;
                    }
                }
                return hasChanges ? newPositions : prev;
            });
            
            const categoryNodes = nodes.filter(n => n.type === "cat");
            const projectNodes = nodes.filter(n => n.type === "proj");

            // lines between projects and projects
            for (let i = 0; i < projectNodes.length; i++) {
                const projectNodeA = projectNodes[i];
                const projectAId = getNodeId(projectNodeA);
                const projectAPos = newPositions[projectAId];
                const projectAData = projectNodeA.data as Project;
                
                if (!projectAPos) continue;
                
                for (let j = i + 1; j < projectNodes.length; j++) {
                    const projectNodeB = projectNodes[j];
                    const projectBId = getNodeId(projectNodeB);
                    const projectBPos = newPositions[projectBId];
                    const projectBData = projectNodeB.data as Project;
                    
                    if (!projectBPos) continue;
                    
                    const sharedCategories = projectAData.categories.filter(cat => 
                        projectBData.categories.includes(cat)
                    );
                    
                    if (sharedCategories.length > 0) {
                        ctx.beginPath();
                        ctx.moveTo(projectAPos.x, projectAPos.y);
                        ctx.lineTo(projectBPos.x, projectBPos.y);
                        ctx.strokeStyle = 'rgba(153, 153, 153, 0.3)';
                        ctx.lineWidth = 1;
                        
                        ctx.stroke();
                        ctx.setLineDash([]);
                    }
                }
            }
            
            // lines between projects and categories
            for (const projectNode of projectNodes) {
                const projectId = getNodeId(projectNode);
                const projectPos = newPositions[projectId];
                const projectData = projectNode.data as Project;
                
                if (!projectPos) continue;
                
                for (const category of projectData.categories) {
                    const categoryNode = categoryNodes.find(n => n.data === category);
                    if (!categoryNode) continue;
                    
                    const categoryId = getNodeId(categoryNode);
                    const categoryPos = newPositions[categoryId];
                    
                    if (!categoryPos) continue;
                    
                    ctx.beginPath();
                    ctx.moveTo(projectPos.x, projectPos.y);
                    ctx.lineTo(categoryPos.x, categoryPos.y);
                    ctx.strokeStyle = 'rgba(102, 102, 102, 0.8)';
                    ctx.lineWidth = 2;
                    ctx.stroke();
                }
            }
            
            animationFrame = requestAnimationFrame(drawEdges);
        };
        
        drawEdges();
        
        return () => {
            cancelAnimationFrame(animationFrame);
            window.removeEventListener('resize', updateCanvasSize);
        };
    }, [nodes, parallaxRef]);

    // random unique floating animation stuff for each node
    const nodeAnimationParams = useRef(nodes.map(node => ({
        xFreq: Math.random() * 0.5 + 1.0, 
        yFreq: Math.random() * 0.5 + 1.0, 
        xPhase: Math.random() * Math.PI * 2,
        yPhase: Math.random() * Math.PI * 2, 
        radius: Math.random() * 2 + 3 
    }))).current;

    return (
        <>
            {/* Render nodes */}
            {nodes.map((node, index) => {
                const nodeId = getNodeId(node);
                const isCategory = node.type === "cat";
                
                let floatX = 0;
                let floatY = 0;
                
                if (!isCategory) {
                    const params = nodeAnimationParams[index];
                    floatX = Math.sin(animationTimeRef.current * params.xFreq + params.xPhase) * params.radius;
                    floatY = Math.cos(animationTimeRef.current * params.yFreq + params.yPhase) * params.radius;
                }
                
                return (
                    <ParallaxLayer 
                        key={nodeId}
                        offset={node.yOffset}
                        speed={Math.random() * 0.4 + 0.8}
                        style={{ 
                            zIndex: isCategory ? 3 : 2,
                            pointerEvents: 'none'
                        }}
                    >
                        <div 
                            style={{ 
                                position: 'absolute',
                                left: `${node.xOffset * 100}%`,
                                transform: 'translateX(-50%)',
                                pointerEvents: 'auto'
                            }}
                        >
                            {isCategory ? (
                                // Category node
                                <div
                                    id={nodeId}
                                    className="node category-node text-viewport-3 font-bold"
                                >
                                    {node.data as string}
                                </div>
                            ) : (
                                // Project node with floating animation
                                <div
                                    id={nodeId}
                                    className="transition-all duration-700 ease-out hover:scale-110 hover:opacity-50"
                                    style={{
                                        width: '1.7vw',
                                        height: '1.7vw',
                                        borderRadius: '50%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                                        cursor: 'pointer',
                                        background: 'white',
                                        transform: `translate(${floatX}px, ${floatY}px)`
                                    }}
                                >
                                </div>
                            )}
                        </div>
                    </ParallaxLayer>
                );
            })}
        </>
    );
};

export default ProjectGraph;