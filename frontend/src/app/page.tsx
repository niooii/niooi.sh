"use client"

import ProjectCard from "@/components/project_card";
import ProjectsGraph, { ProjectGraphNode } from "@/components/projects_graph";
import Mandelbrot from "@/components/vfx/mandelbrot";
import { useSmoothMouse } from "@/hooks/smooth_mouse";
import { FileSystem, Path } from "@/lib/filesystem";
import { ProjectCategory, Tech } from "@/lib/project";
import { IParallax, Parallax, ParallaxLayer } from "@react-spring/parallax";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export default function Home() {
    const fsRef = useRef<FileSystem>(new FileSystem());
    const globalCanvasRef = useRef<HTMLCanvasElement>(null!);
    const [screenWidthDiff, setScreenWidthDiff] = useState(0);
    const [isClientReady, setIsClientReady] = useState(false);
    const [mandelbrotWidth, setMandelbrotWidth] = useState(0);
    const [mandelbrotHeight, setMandelbrotHeight] = useState(0);
    
    useEffect(() => {
        const fs = fsRef.current;

        fs.makeDir(new Path("/home"));
        fs.makeDir(new Path("/home/niooi"));
        let exec = fs.makeFile(new Path("/home/niooi/testexecutable"));
        fs.setExecutable(exec!, (ctx, args) => { ctx.printLn("HELLO WORLD CHAT"); return 0;});
        fs.makeDir(new Path("/notes"));
    }, []);

    const projectGraphNodes: ProjectGraphNode[] = [
        // Project nodes
        {
          data: {
            id: 1,
            name: "Procedural level generation",
            description: "Procedural IKEA level generator with path-finding and room layout algorithms",
            categories: [ProjectCategory.GAME_DEV],
            imageUrl: "projects/procedural_gen.gif",
            usedTech: [Tech.RUST, Tech.CSHARP, Tech.UNITY],
            githubLink: "https://github.com/niooii/procedural-ikea-generation"
          },
          xOffset: 0.35, // Converted from marginLeft: '20%'
          yOffset: 1.34,
          type: "proj"
        },
        {
          data: {
            id: 2,
            name: "GDF",
            description: "Graphics framework built with Vulkan, C and C++",
            categories: [ProjectCategory.SYSTEMS_PROGRAMMING, ProjectCategory.GAME_DEV],
            imageUrl: "projects/gdf.gif",
            usedTech: [Tech.C, Tech.CPP, Tech.VULKAN],
            githubLink: "https://github.com/niooii/gdf"
          },
          xOffset: 0.3, 
          yOffset: 1.65,
          type: "proj"
        },
        {
          data: {
            id: 3,
            name: "Grades Viewer",
            description: "Mobile app for viewing school grades and assignments",
            categories: [ProjectCategory.APP_DEV, ProjectCategory.WEB_DEV],
            imageUrl: "projects/jupiter.gif",
            usedTech: [Tech.RUST, Tech.JAVA, Tech.FLUTTER],
            githubLink: "https://github.com/niooii/jupitered-frontend"
          },
          xOffset: 0.5, 
          yOffset: 1.7,
          type: "proj"
        },
        {
          data: {
            id: 4,
            name: "YOLO CV",
            description: "Computer vision system using YOLO object detection",
            categories: [ProjectCategory.AI_ML, ProjectCategory.APP_DEV],
            imageUrl: "projects/cv.gif",
            usedTech: [Tech.UNITY, Tech.PYTHON],
            githubLink: "https://github.com/BinghamtonRover/Rover-Code"
          },
          xOffset: 0.6, // Converted from marginLeft: '-30%'
          yOffset: 1.3,
          type: "proj"
        },
        {
          data: {
            id: 5,
            name: "Onion OS",
            description: "Custom operating system kernel written in Rust and C",
            categories: [ProjectCategory.SYSTEMS_PROGRAMMING],
            imageUrl: "projects/onion-os-small.gif",
            usedTech: [Tech.C, Tech.RUST],
            githubLink: "https://github.com/niooii/onion-os"
          },
          xOffset: 0.2, // Same as parent layer
          yOffset: 1.4 , // Slightly offset from the previous project
          type: "proj" 
        },
        {
          data: {
            id: 6,
            name: "Music Language Parser",
            description: "A parser",
            categories: [ProjectCategory.FUNCTIONAL],
            imageUrl: "projects/onion-os-small.gif",
            usedTech: [Tech.HASKELL],
            githubLink: "https://github.com/niooii/onion-os"
          },
          xOffset: 0.8,
          yOffset: 1.8 ,
          type: "proj" 
        },
        {
          data: {
            id: 7,
            name: "This Website",
            description: "Ahahah...",
            categories: [ProjectCategory.WEB_DEV],
            imageUrl: "projects/onion-os-small.gif",
            usedTech: [Tech.C],
            githubLink: "https://github.com/niooii/niooi.sh"
          },
          xOffset: 0.66,
          yOffset: 1.8 ,
          type: "proj" 
        },
        {
          data: ProjectCategory.SYSTEMS_PROGRAMMING,
          xOffset: 0.15,
          yOffset: 1.7,
          type: "cat"
        },
        {
          data: ProjectCategory.GAME_DEV,
          xOffset: 0.3,
          yOffset: 1.5,
          type: "cat"
        },
        {
          data: ProjectCategory.APP_DEV,
          xOffset: 0.45,
          yOffset: 1.4,
          type: "cat"
        },
        {
          data: ProjectCategory.WEB_DEV,
          xOffset: 0.6,
          yOffset: 1.6,
          type: "cat"
        },
        {
          data: ProjectCategory.AI_ML,
          xOffset: 0.75,
          yOffset: 1.4,
          type: "cat"
        },
        {
          data: ProjectCategory.FUNCTIONAL,
          xOffset: 0.85,
          yOffset: 1.65,
          type: "cat"
        }
      ];
      

    const parallax = useRef<IParallax>(null!)
    const starsFrontMoveSpeed = 0.55;
    const starsBackMoveSpeed = 0.4;
    const starsBackOpacity = 0.4;

    useEffect(() => {
        const width = Math.max(window.screen.availWidth, window.screen.height);

        setMandelbrotWidth(width);
        setMandelbrotHeight(width);

        setScreenWidthDiff(window.innerWidth - window.screen.availWidth);

        setIsClientReady(true);

        const onresize = () => {
            setScreenWidthDiff(window.innerWidth - window.screen.availWidth);
        };

        addEventListener("resize", onresize);
        return () => window.removeEventListener("resize", onresize);
    }, [])

    return (
        <div style={{ userSelect: 'none', width: '100%', height: '100%', background: '#253237' }}>
        <canvas
            ref={globalCanvasRef}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
                zIndex: -1
            }}
        />
        <Parallax ref={parallax} pages={4}>
            <ParallaxLayer
                offset={1}
                factor={3}
                speed={1}
                className="bg-gradient-to-b from-transparent via-zinc-950/100 to-zinc-950/100"
            />
            <ParallaxLayer offset={2} speed={1} onClick={() => parallax.current.scrollTo(0)} />
            <ParallaxLayer offset={3} speed={1} className="bg-zinc-950" />
            
            {/* Star backgrounds */}
            <ParallaxLayer
                offset={0}
                speed={starsFrontMoveSpeed}
                factor={3}
                style={{
                    backgroundImage: "url(stars.svg)",
                    backgroundRepeat: 'repeat-y',
                    backgroundSize: 'cover',
                }}
            / >
           
            <ParallaxLayer
                offset={0}
                speed={starsBackMoveSpeed}
                factor={3}
                style={{
                    backgroundImage: "url(stars.svg)",
                    backgroundSize: 'cover',
                    backgroundRepeat: 'repeat-y',
                    marginTop: '-20%',
                    marginLeft: '-3%',
                    opacity: starsBackOpacity
                }}
            / >
           
            {/* repeat bc repeat-y doesnt work apparently */}
            <ParallaxLayer
                offset={2}
                speed={starsFrontMoveSpeed}
                factor={3}
                style={{
                    backgroundImage: "url(stars.svg)",
                    backgroundRepeat: 'repeat-y',
                    backgroundSize: 'cover',
                }}
            / >
           
            <ParallaxLayer
                offset={2}
                speed={starsBackMoveSpeed}
                factor={3}
                style={{
                    backgroundImage: "url(stars.svg)",
                    backgroundSize: 'cover',
                    backgroundRepeat: 'repeat-y',
                    marginTop: '-20%',
                    marginLeft: '-3%',
                    opacity: starsBackOpacity
                }}
            / >
            
            {/* Github floating thingy */}
            <ParallaxLayer 
                offset={0.6} 
                speed={-0.45} 
                factor={0}
                style={{ marginLeft: '15%', cursor: "pointer", zIndex: 99 }}  
                >
                <Link href="https://github.com/niooii" target="_blank" rel="noopener noreferrer">
                    <img src={"icons/github-white.svg"} alt="GitHub Profile" />
                </Link>
            </ParallaxLayer>

            <ParallaxLayer offset={2.93} speed={1}>
                <p className="text-xl italic font-medium">The julia set parameterized in 6d. Move your mouse!</p>
            </ParallaxLayer>

            <ParallaxLayer offset={2.35} speed={0.6} style={{ 
                pointerEvents: "none", 
                zIndex: -1, 
                opacity: 1,
                marginLeft: screenWidthDiff / 2
            }}>
                <Mandelbrot 
                    width={mandelbrotWidth} 
                    height={mandelbrotHeight} 
                />
            </ParallaxLayer>
{/* 
            <ParallaxLayer offset={1} speed={0.5} style={{ opacity: 0.1 }}>
                <img src={"sprites/snow.png"} style={{ display: 'block', width: '20%', marginLeft: '70%' }} />
                <img src={"sprites/snow.png"} style={{ display: 'block', width: '20%', marginLeft: '40%' }} />
            </ParallaxLayer>

            <ParallaxLayer offset={1} speed={0.2} style={{ opacity: 0.2 }}>
                <img src={"sprites/snow.png"} style={{ display: 'block', width: '10%', marginLeft: '10%' }} />
                <img src={"sprites/snow.png"} style={{ display: 'block', width: '20%', marginLeft: '75%' }} />
            </ParallaxLayer>

            <ParallaxLayer offset={1.6} speed={-0.1} style={{ opacity: 0.4 }}>
                <img src={"sprites/snow.png"} style={{ display: 'block', width: '20%', marginLeft: '60%' }} />
                <img src={"sprites/snow.png"} style={{ display: 'block', width: '25%', marginLeft: '30%' }} />
                <img src={"sprites/snow.png"} style={{ display: 'block', width: '10%', marginLeft: '80%' }} />
            </ParallaxLayer>

            <ParallaxLayer offset={2.6} speed={0.4} style={{ opacity: 0.6 }}>
                <img src={"sprites/snow.png"} style={{ display: 'block', width: '20%', marginLeft: '5%' }} />
                <img src={"sprites/snow.png"} style={{ display: 'block', width: '15%', marginLeft: '75%' }} />
            </ParallaxLayer> 
            
            <ParallaxLayer offset={1} speed={0.8} style={{ opacity: 0.1 }}>
                <img src={"sprites/snow.png"} style={{ display: 'block', width: '20%', marginLeft: '55%' }} />
                <img src={"sprites/snow.png"} style={{ display: 'block', width: '10%', marginLeft: '15%' }} />
            </ParallaxLayer>
            */}

            <ParallaxLayer
                offset={2}
                speed={-0.3}
                style={{
                    backgroundSize: '80%',
                    backgroundPosition: 'center',
                    // backgroundImage: url('clients', true),
                }}
            />

            {/* Intro */}
            <ParallaxLayer
                offset={0}
                speed={0.1}
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                }}>
                <div style={{ 
                    display: 'flex', 
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    alignItems: 'center', 
                }}>
                    <h1 
                        className="pt-8 text-center text-viewport-6 font-semibold">
                        [🚧 website under construction 🚧]
                    </h1>
                </div>
            </ParallaxLayer>
            <ParallaxLayer
                offset={0}
                speed={0.1}
                onClick={() => parallax.current.scrollTo(1)}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                <div style={{ 
                    display: 'flex', 
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    alignItems: 'center', 
                }}>
                    {/* <img src={"vercel.svg"} style={{ width: '20%' }} /> */}
                    <h1 
                        className="pt-8 text-center text-viewport-10 font-semibold">
                        Hey, I'm Hewitt
                    </h1>
                    <p className="text-viewport-3">I'm a CS + Math major, and I like making things</p>
                    <p className="text-viewport-2 text-gray-300">[click anywhere]</p>
                </div>
            </ParallaxLayer>

            <ParallaxLayer
                offset={0}
                speed={0.9}
                style={{
                    pointerEvents: 'none',
            }}>
                {/* <img className="rounded-md" src={"akaricough.png"} style={{ display: 'block', width: '20%', marginLeft: '70%' , marginTop: '10%' }} /> */}
            </ParallaxLayer>
            
            {/* Projects */}
            <ParallaxLayer
                offset={0.75}
                speed={0.1}
                onClick={() => parallax.current.scrollTo(2)}
                style={{
                    zIndex: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                {/* <img src={"next.svg"} style={{ width: '40%' }} /> */}
                <h1 
                    className="text-center text-viewport-8 font-semibold">
                    Some things I've worked on.
                </h1>
            </ParallaxLayer>
            <div >
                <ProjectsGraph 
                    nodes={projectGraphNodes} 
                    parallaxRef={parallax} 
                    canvasRef={globalCanvasRef}
                />
            </div>

            {/* Background and work history */}
            <ParallaxLayer
                offset={1.8}
                speed={0.1}
                onClick={() => parallax.current.scrollTo(2)}
                style={{
                    zIndex: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                {/* <img src={"next.svg"} style={{ width: '40%' }} /> */}
                <h1 
                    className="text-center text-viewport-10 font-semibold">
                    Education stuff
                </h1>
            </ParallaxLayer>

            {/* Socials */}
            <ParallaxLayer
                offset={3}
                speed={1}
                onClick={() => parallax.current.scrollTo(0)}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                <h1 
                    className="text-center text-6xl font-semibold">
                    Like what you see?
                </h1>
            </ParallaxLayer>

            <ParallaxLayer
            offset={3.7}
            factor={0}
            speed={2}
            style={{ width: '10%', height: '5%', marginLeft: '70%', cursor: "pointer", zIndex: 99 }}
            >
                <Link href="https://discord.com/users/381851699763216386" target="_blank" rel="noopener noreferrer">
                    <img
                    src={"icons/discord.svg"}
                    alt="Discord Profile"
                    />
                </Link>
            </ParallaxLayer>

            <ParallaxLayer
            offset={3.3}
            factor={0}
            speed={2.4}
            style={{ width: '10%', height: '5%', marginLeft: '20%', cursor: "pointer", zIndex: 99 }}
            >
                <Link href="mailto:onioniwonpounoin@gmail.com" target="_blank" rel="noopener noreferrer">
                    <img
                    src={"icons/google-gmail.svg"}
                    alt="Gmail Contact"
                    />
                </Link>
            </ParallaxLayer>
        </Parallax>
    </div>
    );
}
