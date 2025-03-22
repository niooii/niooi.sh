"use client"

import ProjectCard from "@/components/project_card";
import Shell from "@/components/shell";
import Mandelbrot from "@/components/vfx/mandelbrot";
import Winter from "@/components/vfx/winter";
import { useSmoothMouse } from "@/hooks/smooth_mouse";
import { FileSystem, Path } from "@/lib/filesystem";
import { IParallax, Parallax, ParallaxLayer } from "@react-spring/parallax";
import { useEffect, useRef } from "react";

export default function Home() {
    const fsRef = useRef<FileSystem>(new FileSystem());

    useEffect(() => {
        const fs = fsRef.current;

        fs.makeDir(new Path("/home"));
        fs.makeDir(new Path("/home/niooi"));
        let exec = fs.makeFile(new Path("/home/niooi/testexecutable"));
        fs.setExecutable(exec!, (ctx, args) => { ctx.printLn("HELLO WORLD CHAT"); return 0;});
        fs.makeDir(new Path("/notes"));
        
        console.log(fs);
    });

    const parallax = useRef<IParallax>(null!)

    return (
        // <div className="min-h-screen bg-black">
        //     {/* <Shell fs={fsRef.current} /> */}
        //     {/* <Winter spawnRate={10}></Winter> */}
            
        //     <Parallax ref={parallax} pages={3}>
        //         <ParallaxLayer offset={0} speed={1} style={{ backgroundColor: '#805E73' }} />
        //         <ParallaxLayer offset={2} speed={1} style={{ backgroundColor: '#87BCDE' }} />

        //         <ParallaxLayer offset={1} speed={2}> 
        //             <h1 className="text-center text-7xl font-semibold">HI CHAT</h1>
        //             <Mandelbrot width={600} height={600}></Mandelbrot>
        //         </ParallaxLayer>

        //     </Parallax>
        // </div>
        <div style={{ width: '100%', height: '100%', background: '#253237' }}>
        <Parallax ref={parallax} pages={4}>
            <ParallaxLayer offset={1} factor={3} speed={1} style={{ backgroundColor: '#3b3b3b' }} />
            <ParallaxLayer offset={2} speed={1} onClick={() => parallax.current.scrollTo(0)} />
            <ParallaxLayer offset={3} speed={1} style={{ backgroundColor: '#87BCDE' }} />
           
            <ParallaxLayer
            offset={0}
            speed={0}
            factor={3.25}
            style={{
                backgroundImage: "url(stars.svg)",
                backgroundSize: 'cover',
            }}
            / >
            
            {/* Github floating thingy */}
            <ParallaxLayer 
                offset={0.7} 
                speed={-0.3} 
                factor={0}
                style={{ marginLeft: '70%', cursor: "pointer", zIndex: 99 }}  
                >
            <img 
                onClick={() => window.location.href = "https://github.com/niooii"} 
                src={"icons/github-white.svg"} 
                />
            </ParallaxLayer>

            <ParallaxLayer offset={1} speed={0.8} style={{ opacity: 0.1 }}>
                <img src={"sprites/snow.png"} style={{ display: 'block', width: '20%', marginLeft: '55%' }} />
                <img src={"sprites/snow.png"} style={{ display: 'block', width: '10%', marginLeft: '15%' }} />
            </ParallaxLayer>

            <ParallaxLayer offset={2.93} speed={1}>
                <p className="text-xl italic font-medium">The julia set parameterized in 6d. Move your mouse!</p>
            </ParallaxLayer>

            <ParallaxLayer offset={2.35} speed={0.6} style={{ pointerEvents: "none", zIndex: -1, opacity: 1 }}>
                <Mandelbrot width={2000} height={2000}></Mandelbrot>
            </ParallaxLayer>

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
                    <img src={"vercel.svg"} style={{ width: '20%' }} />
                    <h1 
                        className="pt-8 text-center text-7xl font-semibold">
                        Hey, it's nioon
                    </h1>
                </div>
            </ParallaxLayer>

            <ParallaxLayer
                offset={0}
                speed={0.9}
                style={{
                    pointerEvents: 'none',
            }}>
                <img src={"akaricough.png"} style={{ display: 'block', width: '20%', marginLeft: '70%' , marginTop: '10%' }} />
            </ParallaxLayer>
            
            {/* Projects */}
            <ParallaxLayer
                offset={1}
                speed={0.1}
                onClick={() => parallax.current.scrollTo(2)}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                {/* <img src={"next.svg"} style={{ width: '40%' }} /> */}
                <h1 
                    className="text-center text-7xl font-semibold">
                    Some stuff I've worked on.
                </h1>
            </ParallaxLayer>

            <ParallaxLayer 
                offset={1.4} 
                speed={1.2}
                factor={0}
                style={{
                    marginLeft: '70%'
                }}
            >
                <ProjectCard
                    title="Procedural level generation"
                    imageUrl="projects/procedural_gen.gif"
                    technologies={['rust', 'csharp', 'unity']}
                    githubLink="https://github.com/niooii/procedural-ikea-generation"
                    maxWidth={400}
                />
            </ParallaxLayer>

            <ParallaxLayer 
                offset={2.0} 
                speed={-0.3}
                factor={0}
                style={{
                    marginLeft: '30%'
                }}
            >
                <ProjectCard
                    title="GDF (some voxel game)"
                    imageUrl="projects/gdf.gif"
                    technologies={['c', 'cpp', 'vulkan']}
                    githubLink="https://github.com/niooii/gdf"
                    maxWidth={400}
                />
            </ParallaxLayer>

            <ParallaxLayer 
                offset={2.0} 
                speed={1.5}
                factor={0}
                style={{
                    marginLeft: '60%'
                }}
            >
                <ProjectCard
                    title="Jupiter Ed App"
                    imageUrl="akari.png"
                    technologies={['rust', 'java', 'flutter']}
                    githubLink="https://github.com/niooii/jupitered-frontend"
                    maxWidth={400}
                />
            </ParallaxLayer>

            <ParallaxLayer 
                offset={1.7} 
                speed={1.3}
                factor={0}
                style={{
                    marginLeft: '20%'
                }}
            >
                <ProjectCard
                    title="Onion OS"
                    imageUrl="akari.png"
                    technologies={['C', 'rust']}
                    githubLink="https://github.com/niooii/onion-os"
                    maxWidth={400}
                />
            </ParallaxLayer>
            
            {/* Socials */}
            <ParallaxLayer
                offset={3}
                speed={0.1}
                onClick={() => parallax.current.scrollTo(2)}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                <h1 
                    className="text-center text-6xl font-semibold text-gray-700 underline">
                    You can find me on
                </h1>
            </ParallaxLayer>

            <ParallaxLayer 
                offset={4} 
                speed={-0.3} 
                style={{ width: '10%', height: '5%', marginLeft: '70%', cursor: "pointer", zIndex: 99 }}  
                >
            <img 
                onClick={() => window.location.href = "https://discord.com/users/381851699763216386"} 
                src={"icons/discord.svg"} 
                />
            </ParallaxLayer>
        </Parallax>
    </div>
    );
}
