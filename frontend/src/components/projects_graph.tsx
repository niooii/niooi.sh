import React, { useEffect, useRef, useState } from "react";
import { IParallax, ParallaxLayer } from "@react-spring/parallax";
import Project, { ProjectCategory } from "@/lib/project";
import ReactDOM from "react-dom";
import { motion } from "framer-motion";

export interface ProjectGraphNode {
    data: Project | ProjectCategory;
    xOffset: number;
    yOffset: number;
    marginTop?: string
}

type NodePositions = Record<string, { x: number, y: number }>;

interface ProjectGraphProps {
    nodes: ProjectGraphNode[];
    parallaxRef: React.RefObject<IParallax>;
    canvasRef: React.RefObject<HTMLCanvasElement>;
}

const ProjectGraph: React.FC<ProjectGraphProps> = ({ nodes, parallaxRef, canvasRef }) => {
    const [initialHoverSide, setInitialHoverSide] = useState<{ left: boolean, top: boolean } | null>(null);
    const [animationTime, setAnimationTime] = useState(0);
    const [hoveredNode, setHoveredNode] = useState<ProjectGraphNode | null>(null);
    const [lastHoveredNode, setLastHoveredNode] = useState<ProjectGraphNode | null>(null);
    const [lockedIn, setLockedIn] = useState<boolean>(false);
    const [nodePositions, setNodePositions] = useState<NodePositions>({});
    
    const getNodeId = (node: ProjectGraphNode): string => 
        typeof node.data !== "string" ? `project-${(node.data as Project).name}` : `category-${node.data as ProjectCategory}`;

    const startTimeRef = useRef<number>(Date.now());

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };
      
    const item = {
        hidden: { opacity: 0 },
        show: { opacity: 1 }
    };

    // hack to preload all images
    useEffect(() => {
        const projectNodes = nodes.filter(n => 
            typeof n.data !== "string" && (n.data as Project).imageUrl
        );
        
        projectNodes.forEach(node => {
            const project = node.data as Project;
            const img = new Image();
            img.src = project.imageUrl!;
            console.log("preloading img");
        });
    }, [nodes]); 
    
    useEffect(() => {
        if (!parallaxRef.current || !canvasRef.current) return;
        
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        
        const updateCanvasSize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        
        updateCanvasSize();
        window.addEventListener("resize", updateCanvasSize);
        
        let animationFrame: number;
        
        const drawEdges = () => {
            const time = (Date.now() - startTimeRef.current) / 1000;
            setAnimationTime(time);
            
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

            setNodePositions(newPositions);
            
            const categoryNodes = nodes.filter(n => typeof n.data === "string");
            const projectNodes = nodes.filter(n => typeof n.data !== "string");

            // lines between projects and projects
            for (let i = 0; i < projectNodes.length; i++) {
                const a = projectNodes[i];
                const aId = getNodeId(a);
                const aPos = newPositions[aId];
                const aData = a.data as Project;
                
                if (!aPos) continue;
                
                for (let j = i + 1; j < projectNodes.length; j++) {
                    const b = projectNodes[j];
                    const bId = getNodeId(b);
                    const bPos = newPositions[bId];
                    const bData = b.data as Project;
                    
                    if (!bPos) continue;
                    
                    const sharedCategories = aData.categories.filter(cat => 
                        bData.categories.includes(cat)
                    );
                    
                    if (sharedCategories.length > 0) {
                        ctx.beginPath();
                        ctx.moveTo(aPos.x, aPos.y);
                        ctx.lineTo(bPos.x, bPos.y);
                        
                        // reduce opacity if either project is being hovered
                        const isEitherHovered = hoveredNode && 
                            (aData.name === (hoveredNode.data as Project).name || bData.name === (hoveredNode.data as Project).name);
                        ctx.strokeStyle = isEitherHovered 
                            ? "rgba(153, 153, 153, 0.8)" 
                            : "rgba(153, 153, 153, 0.3)";
                            
                        ctx.lineWidth = 1;
                        ctx.stroke();
                        ctx.setLineDash([]);
                    }
                }
            }
            
            // lines between projects and categories
            for (const projectNode of projectNodes) {
                const pId = getNodeId(projectNode);
                const pPos = newPositions[pId];
                const pData = projectNode.data as Project;
                
                if (!pPos) continue;
                
                for (const category of pData.categories) {
                    const categoryNode = categoryNodes.find(n => n.data === category);
                    if (!categoryNode) continue;
                    
                    const catId = getNodeId(categoryNode);
                    const catPos = newPositions[catId];
                    
                    if (!catPos) continue;
                    
                    ctx.beginPath();
                    ctx.moveTo(pPos.x, pPos.y);
                    ctx.lineTo(catPos.x, catPos.y);
                    
                    // highlight connections
                    const isHovered = hoveredNode && pData.name === (hoveredNode.data as Project).name;
                    ctx.strokeStyle = isHovered 
                        ? "rgba(255, 255, 255, 0.9)" 
                        : "rgba(102, 102, 102, 0.8)";
                    ctx.lineWidth = isHovered ? 3 : 2;
                    ctx.stroke();
                }
            }
            
            animationFrame = requestAnimationFrame(drawEdges);
        };
        
        drawEdges();
        
        return () => {
            cancelAnimationFrame(animationFrame);
            window.removeEventListener("resize", updateCanvasSize);
        };
    }, [nodes, parallaxRef, hoveredNode]);

    // random unique floating animation stuff for each node
    const nodeAnimationParams = useRef(nodes.map(node => ({
        xFreq: Math.random() * 0.5 + 1.0, 
        yFreq: Math.random() * 0.5 + 1.0, 
        xPhase: Math.random() * Math.PI * 2,
        yPhase: Math.random() * Math.PI * 2, 
        radius: Math.random() * 2 + 3 
    }))).current;

    const getTooltipPosition = (nodeId: string) => {
        const nodePosition = nodePositions[nodeId];
        if (!nodePosition) return {};
        
        const isOnLeft = initialHoverSide?.left;
        const isOnTop = initialHoverSide?.top;
        
        return {
            position: "absolute",
            left: `${nodePosition.x}px`,
            top: `${nodePosition.y}px`,
            transform: `translate(${!isOnLeft ? "25%" : "-125%"}, ${!isOnTop ? "25%" : "-125%"})`,
            textAlign: isOnLeft ? "left" : "right",
            whiteSpace: "nowrap"
        };
    };

    const renderPopup = () => {
        var project: Project | null = null;
        
        var nodeId: string = "";
        var tooltipStyles;

        if (lastHoveredNode) {
            project = (lastHoveredNode?.data as Project);
            nodeId = getNodeId(lastHoveredNode);
            tooltipStyles = getTooltipPosition(nodeId);
        }

        return ReactDOM.createPortal(
            <>
                {/* Background dimming */}
                <div
                    className="fixed inset-0 bg-black z-50 transition-opacity duration-300 pointer-events-none" 
                    style={{ 
                        opacity: hoveredNode ? (lockedIn ? 0.5 : 0.7) : 0,
                        pointerEvents: lockedIn ? "auto" : "none"
                    }}
                    onClick={() => {
                        setLockedIn(false);
                        setHoveredNode(null);
                    }}
                />
                
                <div 
                    className="fixed inset-0 flex items-center z-50 transition-opacity duration-300"
                    style={{ 
                        opacity: hoveredNode ? 1 : 0,
                        pointerEvents: "none",
                    }}
                >
                    {/* Tooltip thingy */}
                    {lastHoveredNode && (
                        <p 
                            className="font-semibold absolute transition-opacity text-viewport-[1.8] pointer-events-none"
                            style={{ 
                                // ah yes
                                opacity: hoveredNode ? ((lockedIn) ? 0 : 1) : 0,
                                ...tooltipStyles
                            }}
                        >
                            [click for more]
                        </p>
                    )}

                    {/* Hover popup */}
                    {(lastHoveredNode && nodeId && project) && (<div 
                        className="rounded-2xl shadow-lg p-6 pointer-events-none transition-opacity duration-300 ease-out"
                        style={{
                            backgroundColor: `rgb(9 9 11 / 0.6)`,
                            width: `30vw`,
                            opacity: hoveredNode ? ((lockedIn) ? 0 : 1) : 0,
                            height: "fit-content",
                            position: "absolute",
                            top: 0,
                            bottom: 0,
                            margin: "auto",
                            left: initialHoverSide?.left
                                ? `${nodePositions[nodeId]?.x + 50}px` 
                                : `${nodePositions[nodeId]?.x - 50 - 30 * window.innerWidth / 100}px`
                        }}
                    >
                        {project.imageUrl && (
                            <div 
                                className="m-5 mb-4 overflow-hidden"
                                style={{ 
                                    display: "flex", 
                                    flexDirection: "column",
                                    justifyContent: "space-between",
                                    alignItems: "center", 
                                }}
                            >
                                <img 
                                    src={project.imageUrl} 
                                    alt={project.name}
                                    className="rounded-xl object-contain max-h-[50vh] max-w-[18vw]"
                                    style={{ width: 'auto', height: 'auto' }}
                                />
                            </div>
                        )}
                        
                        <h3 className="text-viewport-3 font-semibold block text-center">{project.name}</h3>
                        
                        <p className="text-viewport-[2] italic block text-center">{project.description}</p>
                        
                        <p 
                            className="transition-all text-red-500 text-viewport-[1.8] block text-center"
                            style={{ opacity: lockedIn ? 1 : 0 }}
                        >[TODO: Summary, buttons, etc]</p>
                    </div>)}
                    
                    {/* Fullscreen details */}
                    {(lastHoveredNode && nodeId && project) && (
                    <div
                        className="rounded-2xl shadow-lg p-6 transition-opacity duration-300 ease-out overflow-y-auto"
                        style={{
                            backgroundColor: `rgb(9 9 11 / 0.96)`,
                            width: `80vw`,
                            opacity: lockedIn ? 1 : 0,
                            height: "80vh",
                            position: "absolute",
                            top: 0,
                            bottom: 0,
                            margin: "auto",
                            transform: "translate(-50%, 0)",
                            left: "50%",
                            pointerEvents: lockedIn ? "auto" : "none"
                        }}
                    >
                        <div className="flex flex-col items-center justify-center">
                            {project.imageUrl && (
                                <div className="mb-6 flex justify-center">
                                    <img
                                        src={project.imageUrl}
                                        alt={project.name}
                                        className="rounded-xl object-contain max-h-[40vh]"
                                        style={{ width: 'auto', height: 'auto' }}
                                    />
                                </div>
                            )}
                        
                            <h2 className="text-viewport-4 font-bold mb-2 text-center">{project.name}</h2>
                        
                            <p className="text-viewport-[2] italic mb-4 text-center max-w-2xl">{project.description}</p>
                            
                            {/* summary section */}
                            {project.summary && (
                                <div className="mb-6 max-w-3xl">
                                    <p className="text-viewport-[1.8] leading-relaxed text-center sm:text-left">
                                        {project.summary}
                                    </p>
                                </div>
                            )}
                            
                            {/* tech stack */}
                            {project.usedTech && project.usedTech.length > 0 && (
                                <div className="mt-6">
                                    <motion.div 
                                        className="flex flex-wrap justify-center gap-4"
                                        variants={container}
                                        initial="hidden"
                                        animate={lockedIn ? "show" : "hidden"}
                                    >
                                    {project.usedTech.map((tech) => (
                                        <motion.div 
                                            key={tech} 
                                            className="flex flex-col items-center"
                                            variants={item}
                                        >
                                        <div className="bg-zinc-800 rounded-lg p-3 flex items-center justify-center h-16 w-16">
                                            <img 
                                                src={`/icons/${tech.toLowerCase()}.svg`} 
                                                alt={tech.replace(/_/g, ' ')} 
                                                className="h-10 w-10 object-contain"
                                            />
                                        </div>
                                        <span className="text-viewport-1 mt-1 opacity-80 font-bold">
                                            {tech.replace(/_/g, ' ').toLowerCase().split(' ').map(
                                            word => word.charAt(0).toUpperCase() + word.slice(1)
                                            ).join(' ')}
                                        </span>
                                        </motion.div>
                                    ))}
                                    </motion.div>
                                </div>
                            )}
                            <h1 className="mt-5 text-red-600">
                            TODO: github link button 
                            </h1>
                        </div>
                    </div>
                )}
                </div>
            </>,
            document.body
        );
    };

    return (
        <>
            {/* Render nodes */}
            {nodes.map((node, index) => {
                // apply the little floating effects
                const nodeId = getNodeId(node);
                const isCategory = typeof node.data === "string";
                
                let floatX = 0;
                let floatY = 0;
                
                if (!isCategory) {
                    const params = nodeAnimationParams[index];

                    const effectRadius = params.radius
                    
                    floatX = Math.sin(animationTime * params.xFreq + params.xPhase) * effectRadius;
                    floatY = Math.cos(animationTime * params.yFreq + params.yPhase) * effectRadius;
                }
                
                return (
                    <ParallaxLayer 
                        key={nodeId}
                        offset={node.yOffset}
                        speed={Math.random() * 0.4 + 0.8}
                        style={{ 
                            pointerEvents: "none",
                            transition: "opacity 0.3s ease",
                        }}
                    >
                        <div 
                            style={{ 
                                position: "absolute",
                                left: `${node.xOffset * 100}%`,
                                transform: "translateX(-50%)",
                                pointerEvents: "auto",
                                marginTop: node.marginTop ?? 0
                            }}
                        >
                            {isCategory ? (
                                // Category node
                                <div
                                    id={nodeId}
                                    className={`transition-colors duration-300 z-10 node category-node text-viewport-3 font-bold ${
                                        hoveredNode ? 
                                        (hoveredNode.data as Project).categories.includes(node.data as ProjectCategory) 
                                                ? "text-white" : "text-gray-300" 
                                            : ""
                                    }`}
                                >
                                    {node.data as string}
                                </div>
                            ) : (
                                // Project node
                                // invisible border around it that triggers on hover
                                <div
                                    style={{
                                        width: "3.2vw",
                                        height: "3.2vw", 
                                        position: "relative",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        transform: `translate(${floatX}px, ${floatY}px)`,
                                        pointerEvents: "auto",
                                        zIndex: hoveredNode && (node.data as Project).name === (hoveredNode.data as Project).name ? 50 : 2
                                    }}
                                    onMouseLeave={() => {
                                        if (!lockedIn) {
                                            setHoveredNode(null);
                                        }
                                    }}
                                >
                                    <div
                                        id={nodeId}
                                        className="transition-all duration-300 ease-out hover:scale-110"
                                        style={{
                                            width: "1.6vw",
                                            height: "1.6vw",
                                            borderRadius: "50%",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            boxShadow: hoveredNode && (node.data as Project).name === (hoveredNode.data as Project).name 
                                                ? "0 0 2vw rgba(255,221,33,1)" // yellow aura
                                                : "0 0 1vw rgba(255,255,255,0.7)", // white aura
                                            cursor: "pointer",
                                            background: hoveredNode && (node.data as Project).name === (hoveredNode.data as Project).name 
                                                ? "#000000" 
                                                : "#FFFFFF",
                                        }}
                                        onMouseEnter={(e) => {
                                            const nodePos = nodePositions[nodeId];
                                            if (nodePos) {
                                                setInitialHoverSide({
                                                    left: nodePos.x < window.innerWidth / 2,
                                                    top: nodePos.y < window.innerHeight / 2
                                                });
                                            }
                                            setLastHoveredNode(node);
                                            setHoveredNode(node);
                                        }}
                                        onClick={() => {
                                            setLockedIn(true);
                                        }}
                                    >
                                    </div>
                                </div>
                            )}
                        </div>
                    </ParallaxLayer>
                );
            })}

            {/* render through portal */}
            {renderPopup()}
        </>
    );
};

export default ProjectGraph;