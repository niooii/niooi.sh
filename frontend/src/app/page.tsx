"use client"

import ProjectCard from "@/components/project_card";
import Shell from "@/components/shell";
import Mandelbrot from "@/components/vfx/mandelbrot";
import Winter from "@/components/vfx/winter";
import { useSmoothMouse } from "@/hooks/smooth_mouse";
import { FileSystem, Path } from "@/lib/filesystem";
import { IParallax, Parallax, ParallaxLayer } from "@react-spring/parallax";
import { useEffect, useRef, useState } from "react";

export default function Home() {
    const fsRef = useRef<FileSystem>(new FileSystem());
    const [screenWidthDiff, setScreenWidthDiff] = useState(
        window.innerWidth - window.screen.availWidth
    );
    
    useEffect(() => {
        const fs = fsRef.current;

        fs.makeDir(new Path("/home"));
        fs.makeDir(new Path("/home/niooi"));
        let exec = fs.makeFile(new Path("/home/niooi/testexecutable"));
        fs.setExecutable(exec!, (ctx, args) => { ctx.printLn("HELLO WORLD CHAT"); return 0;});
        fs.makeDir(new Path("/notes"));
    }, []);

    const parallax = useRef<IParallax>(null!)
    const starsFrontMoveSpeed = 0.5;
    const starsBackMoveSpeed = 0.4;
    const starsBackOpacity = 0.4;
    const mandelbrotWidth = Math.max(window.screen.availWidth, window.screen.height);
    const mandelbrotHeight = mandelbrotWidth;

    useEffect(() => {
        const onresize = () => {
            setScreenWidthDiff(window.innerWidth - window.screen.availWidth);
        };

        addEventListener("resize", onresize);
        return () => window.removeEventListener("resize", onresize);
    }, [])

    return (
        <div style={{ userSelect: 'none', width: '100%', height: '100%', background: '#253237' }}>
        <Parallax ref={parallax} pages={4}>
            <ParallaxLayer
                offset={1}
                factor={3}
                speed={1}
                className="bg-gradient-to-b from-transparent via-neutral-800/100 to-neutral-800/100"
            />
            <ParallaxLayer offset={2} speed={1} onClick={() => parallax.current.scrollTo(0)} />
            <ParallaxLayer offset={3} speed={1} className="bg-neutral-800" />
            
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

            <ParallaxLayer offset={2.35} speed={0.6} style={{ 
                pointerEvents: "none", 
                zIndex: -1, 
                opacity: 1,
                marginLeft: screenWidthDiff / 2
            }}>
                <Mandelbrot width={mandelbrotWidth} height={mandelbrotHeight}></Mandelbrot>
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
                        [🚧 website still under construction! 🚧]
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
                    <img src={"vercel.svg"} style={{ width: '20%' }} />
                    <h1 
                        className="pt-8 text-center text-viewport-10 font-semibold">
                        Hey, it's nioon
                    </h1>
                    <p className="text-viewport-3">I'm a CS + math major, and I'm addicted to making stuff</p>
                    <p className="text-viewport-2 text-gray-300">[click me! or don't, you can just scroll]</p>
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
                offset={1}
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
                    Some things I've worked on.
                </h1>
            </ParallaxLayer>

            <ParallaxLayer 
                offset={1.34} 
                speed={0.8}
                factor={0}
                style={{
                    zIndex: 3,
                    marginLeft: '20%'
                }}
            >
                <ProjectCard
                    title="Procedural level generation"
                    imageUrl="projects/procedural_gen.gif"
                    technologies={['rust', 'csharp', 'unity']}
                    githubLink="https://github.com/niooii/procedural-ikea-generation"
                    width={20}
                />
            </ParallaxLayer>

            <ParallaxLayer 
                offset={2.0} 
                speed={-0.3}
                factor={0}
                style={{
                    marginLeft: '-20%',
                    zIndex: 2
                }}
            >
                <ProjectCard
                    title="GDF"
                    imageUrl="projects/gdf.gif"
                    technologies={['c', 'cpp', 'vulkan']}
                    githubLink="https://github.com/niooii/gdf"
                    width={25}
                />
            </ParallaxLayer>

            <ParallaxLayer 
                offset={1.7} 
                speed={1.2}
                factor={0}
                style={{
                    marginLeft: '10%',
                    opacity: '70%'
                }}
            >
                <ProjectCard
                    title="Jupiter Ed App"
                    imageUrl="projects/jupiter.gif"
                    technologies={['rust', 'java', 'flutter']}
                    githubLink="https://github.com/niooii/jupitered-frontend"
                    width={15}
                />
            </ParallaxLayer>

            <ParallaxLayer 
                offset={1.3} 
                speed={0.5}
                factor={0}
                style={{
                    marginLeft: '-30%',
                    opacity: 0.8
                }}
            >
                <ProjectCard
                    title="Onion OS"
                    imageUrl="projects/onion-os-small.gif"
                    technologies={['C', 'rust']}
                    githubLink="https://github.com/niooii/onion-os"
                />
            </ParallaxLayer>
            
            {/* Socials */}
            <ParallaxLayer
                offset={3}
                speed={1}
                onClick={() => parallax.current.scrollTo(2)}
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
            <img 
                onClick={() => window.location.href = "https://discord.com/users/381851699763216386"} 
                src={"icons/discord.svg"} 
                />
            </ParallaxLayer>

            <ParallaxLayer 
                offset={3.3} 
                factor={0}
                speed={2.4} 
                style={{ width: '10%', height: '5%', marginLeft: '20%', cursor: "pointer", zIndex: 99 }}  
                >
            <img 
                onClick={() => window.location.href = "https://discord.com/users/381851699763216386"} 
                src={"icons/google-gmail.svg"} 
                />
            </ParallaxLayer>
        </Parallax>
    </div>
    );
}
