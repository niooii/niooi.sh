"use client"

import ProjectCard from "@/components/project_card";
import ProjectsGraph, { ProjectGraphNode } from "@/components/projects_graph";
import TimeCounter from "@/components/time_counter";
import { FileSystem, Path } from "@/lib/filesystem";
import { FLYING_HORSE, GDF, IKEA_GAME, JUPITER_ED, MUSIC_LANG, ONION_OS, ProjectCategory, Tech, OCLOUD, YOLO_CV, BARRIER_ST, MANDELBULB_RENDER, JULIA_RENDER, DISCORD_USER, DISCORD_CLONER, SCORN, SHADER_APP, OSU } from "@/lib/project";
import { IParallax, Parallax, ParallaxLayer } from "@react-spring/parallax";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useMotionValue, motion, useTransform, useSpring, useMotionValueEvent } from "framer-motion"
import CommitInfo from "@/components/version_info";
import CategoryMenu from "@/components/category_menu";

export default function Home() {
    const fsRef = useRef<FileSystem>(new FileSystem());
    const globalCanvasRef = useRef<HTMLCanvasElement>(null!);
    const parallax = useRef<IParallax>(null!)

    const scrollProgress = useMotionValue(0);
    // YES SMOOTH ROTATION FINALLY WORKS?
    const smoothScrollProgress = useSpring(scrollProgress, {
        bounce: 0,
        damping: 20, 
        mass: 0.1  
    })
    
    useEffect(() => {
        const fs = fsRef.current;
        fs.makeDir(new Path("/home"));
        fs.makeDir(new Path("/home/niooi"));
        let exec = fs.makeFile(new Path("/home/niooi/testexecutable"));
        fs.setExecutable(exec!, (ctx, args) => { ctx.printLn("HELLO WORLD CHAT"); return 0;});
        fs.makeDir(new Path("/notes"));
    }, []);

    // All projects array for the category menu
    const allProjects = [
        GDF,
        FLYING_HORSE,
        SCORN,
        IKEA_GAME,
        OSU,
        YOLO_CV,
        MANDELBULB_RENDER,
        JULIA_RENDER,
        SHADER_APP,
        JUPITER_ED,
        ONION_OS,
        DISCORD_USER,
        DISCORD_CLONER,
        OCLOUD,
        BARRIER_ST,
        MUSIC_LANG,
    ];

    const starsFrontMoveSpeed = 0.55;
    const starsBackMoveSpeed = 0.4;
    const starsBackOpacity = 0.4;

    const handleScroll = () => {
        console.log("HEY world")
        const _scrollProgress = parallax.current.current / parallax.current.space
        console.log(_scrollProgress);
        scrollProgress.set(_scrollProgress * 100);
        console.log(scrollProgress);
    }

    useEffect(() => {
        const container = parallax.current?.container
            .current as HTMLDivElement

        container.onscroll = handleScroll;
    }, [])
      
    return (
        <div style={{ userSelect: "none", width: "100%", height: "100%", background: "#253237" }}>
        <canvas
            ref={globalCanvasRef}
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                pointerEvents: "none",
                zIndex: -1
            }}
        />
        <Parallax ref={parallax} pages={4}>
            <ParallaxLayer
                offset={0}
                factor={1}
                speed={1}
                className="bg-black"
            />
            <ParallaxLayer offset={2} factor={2} speed={1} className="bg-black" />
            {/* <ParallaxLayer offset={2} factor={2} speed={1} className="bg-black">
                <motion.img 
                    className="bg-white w-50 h-50"
                    src="akaricough.png"
                    // smooth rotation test
                    style={{ rotate: smoothScrollProgress }} 
                >
                </motion.img>
            </ParallaxLayer> */}
            <ParallaxLayer offset={3} factor={1} speed={1} className="bg-zinc-950" />
            
            {/* Star backgrounds */}
            <ParallaxLayer
                offset={0}
                speed={starsFrontMoveSpeed}
                factor={3}
                style={{
                    backgroundImage: "url(stars.svg)",
                    backgroundRepeat: "repeat-y",
                    backgroundSize: "cover",
                }}
            / >
           
            <ParallaxLayer
                offset={0}
                speed={starsBackMoveSpeed}
                factor={3}
                style={{
                    backgroundImage: "url(stars.svg)",
                    backgroundSize: "cover",
                    backgroundRepeat: "repeat-y",
                    marginTop: "-20%",
                    marginLeft: "-3%",
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
                    backgroundRepeat: "repeat-y",
                    backgroundSize: "cover",
                }}
            / >
           
            <ParallaxLayer
                offset={2}
                speed={starsBackMoveSpeed}
                factor={3}
                style={{
                    backgroundImage: "url(stars.svg)",
                    backgroundSize: "cover",
                    backgroundRepeat: "repeat-y",
                    marginTop: "-20%",
                    marginLeft: "-3%",
                    opacity: starsBackOpacity
                }}
            / >

            {/* <ParallaxLayer offset={2.93} speed={1}>
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
            </ParallaxLayer> */}
{/* 
            <ParallaxLayer offset={1} speed={0.5} style={{ opacity: 0.1 }}>
                <img src={"sprites/snow.png"} style={{ display: "block", width: "20%", marginLeft: "70%" }} />
                <img src={"sprites/snow.png"} style={{ display: "block", width: "20%", marginLeft: "40%" }} />
            </ParallaxLayer>

            <ParallaxLayer offset={1} speed={0.2} style={{ opacity: 0.2 }}>
                <img src={"sprites/snow.png"} style={{ display: "block", width: "10%", marginLeft: "10%" }} />
                <img src={"sprites/snow.png"} style={{ display: "block", width: "20%", marginLeft: "75%" }} />
            </ParallaxLayer>

            <ParallaxLayer offset={1.6} speed={-0.1} style={{ opacity: 0.4 }}>
                <img src={"sprites/snow.png"} style={{ display: "block", width: "20%", marginLeft: "60%" }} />
                <img src={"sprites/snow.png"} style={{ display: "block", width: "25%", marginLeft: "30%" }} />
                <img src={"sprites/snow.png"} style={{ display: "block", width: "10%", marginLeft: "80%" }} />
            </ParallaxLayer>

            <ParallaxLayer offset={2.6} speed={0.4} style={{ opacity: 0.6 }}>
                <img src={"sprites/snow.png"} style={{ display: "block", width: "20%", marginLeft: "5%" }} />
                <img src={"sprites/snow.png"} style={{ display: "block", width: "15%", marginLeft: "75%" }} />
            </ParallaxLayer> 
            
            <ParallaxLayer offset={1} speed={0.8} style={{ opacity: 0.1 }}>
                <img src={"sprites/snow.png"} style={{ display: "block", width: "20%", marginLeft: "55%" }} />
                <img src={"sprites/snow.png"} style={{ display: "block", width: "10%", marginLeft: "15%" }} />
            </ParallaxLayer>
            */}

            <ParallaxLayer
                offset={2}
                speed={-0.3}
                style={{
                    backgroundSize: "80%",
                    backgroundPosition: "center",
                    // backgroundImage: url("clients", true),
                }}
            />

            {/* Intro */}
            {/* <ParallaxLayer
                offset={0.1}
                speed={1.6}
                className="w-fit h-fit"
                style={{
                    marginLeft: "20%",
                    zIndex: 2
                }}
                factor={0}
            >
                <h1 
                    onClick={() => parallax.current.scrollTo(2)}
                    className="w-fit h-fit transition-opacity duration-300 hover:opacity-50 cursor-pointer underline pt-8 text-viewport-2 font-semibold">
                    About me
                </h1>
            </ParallaxLayer>
            <ParallaxLayer
                offset={0.09}
                speed={2}
                className="w-fit h-fit"
                style={{
                    marginLeft: "50%",
                    zIndex: 2
                }}
                factor={0}
            >
                <h1 
                    onClick={() => parallax.current.scrollTo(1)}
                    className="w-fit h-fit transition-opacity duration-300 hover:opacity-50 cursor-pointer underline pt-8 text-viewport-2 font-semibold">
                    Portfolio
                </h1>
            </ParallaxLayer>
            <ParallaxLayer
                offset={0.1}
                speed={2.5}
                className="w-fit h-fit"
                style={{
                    marginLeft: "80%",
                    zIndex: 2
                }}
                factor={0}
            >
                <h1 
                    onClick={() => parallax.current.scrollTo(3)}
                    className="w-fit h-fit transition-opacity duration-300 hover:opacity-50 cursor-pointer underline pt-8 text-viewport-2 font-semibold">
                    Contacts
                </h1>
            </ParallaxLayer> */}
            <ParallaxLayer
                offset={0}
                speed={2}
            >
                {/* <h1 
                    className="block pt-8 text-center text-viewport-5 font-semibold">
                    [🚧 website under construction 🚧]
                </h1> */}
                <CommitInfo className="m-5 text-viewport-2" />
            </ParallaxLayer>
            <ParallaxLayer
                offset={0}
                speed={0.1}
                onClick={() => parallax.current.scrollTo(1)}
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}>
                <div style={{ 
                    display: "flex", 
                    flexDirection: "column",
                    justifyContent: "space-between",
                    alignItems: "center", 
                }}>
                    {/* <img src={"vercel.svg"} style={{ width: "20%" }} /> */}
                    <h1 
                        className="pt-8 text-center text-viewport-10 font-semibold">
                        Hey, I'm Hewitt
                    </h1>
                    <p className="text-viewport-3">CS + Math major | I like making stuff</p>
                    <p className="text-viewport-2 text-gray-300">[click anywhere]</p>
                </div>
            </ParallaxLayer>

            <ParallaxLayer
                offset={0}
                speed={0.9}
                style={{
                    pointerEvents: "none",
            }}>
                {/* <img className="rounded-md" src={"akaricough.png"} style={{ display: "block", width: "20%", marginLeft: "70%" , marginTop: "10%" }} /> */}
            </ParallaxLayer>
            
            {/* Projects */}
            <ParallaxLayer
                offset={1}
                speed={1.8}
                style={{
                    zIndex: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}>
                <div style={{ 
                    marginTop: "-35%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                }}>
                    <h1 
                        className="text-center text-viewport-8 font-semibold mb-8">
                        I've done some things...
                    </h1>
                   
                </div>
            </ParallaxLayer>

            <ParallaxLayer
                offset={1.4}
                speed={1.6}
                style={{
                    zIndex: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}>
                <div style={{ 
                    marginTop: "-45%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                }}>
                <CategoryMenu projects={allProjects} />
                </div>
            </ParallaxLayer>

            {/* Background and work history */}
            <ParallaxLayer
                offset={2}
                speed={2}
                factor={0.5}
                onClick={() => parallax.current.scrollTo(2.5)}
                style={{
                    zIndex: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}>
                <h1 
                    className="text-center text-viewport-8 font-semibold"
                    style={{
                        marginTop: "-17%"
                    }}
                >
                    Real things too...
                </h1>
            </ParallaxLayer>
            <ParallaxLayer
                offset={2.2}
                speed={2.5}
                factor={0}
                style={{
                    zIndex: 1,
                }}>
                    <h1 className="text-viewport-3 font-semibold block text-center">WIP...</h1>
                {/* <TimeCounter className="text-viewport-3 font-semibold block text-center" prefix="Total playtime: " from={new Date(2006, 5, 22)}></TimeCounter> */}
            </ParallaxLayer>
            <ParallaxLayer
                offset={2.3}
                speed={2.5}
                factor={0}
                style={{
                    zIndex: 1,
                }}>
                <h1 
                    className="text-center text-viewport-3 font-semibold"
                >
                    ???
                </h1>
            </ParallaxLayer>

            {/* Socials */}
            <ParallaxLayer
                offset={3}
                speed={1.8}
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "column"
                }}>
                <h1 
                    className="text-center text-viewport-7 font-semibold mt-8">
                    If you're still reading,
                </h1>
                <p>You either need me for something or you're very bored. Reach out?</p>
            </ParallaxLayer>

            <ParallaxLayer
            offset={3.7}
            factor={0}
            speed={2}
            style={{ width: "10%", height: "5%", marginLeft: "70%", cursor: "pointer", zIndex: 99 }}
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
            style={{ width: "10%", height: "5%", marginLeft: "20%", cursor: "pointer", zIndex: 99 }}
            >
                <Link href="mailto:onioniwonpounoin@gmail.com" target="_blank" rel="noopener noreferrer">
                    <img
                    src={"icons/google-gmail.svg"}
                    alt="Gmail Contact"
                    />
                </Link>
            </ParallaxLayer>
            {/* Github floating thingy */}
            <ParallaxLayer 
                offset={3.3} 
                speed={2.1} 
                factor={0}
                style={{ width: "20%", height: "5%", marginLeft: "55%", cursor: "pointer", zIndex: 99 }}  
                >
                <Link href="https://github.com/niooii" target="_blank" rel="noopener noreferrer">
                    <img src={"icons/github-white.svg"} alt="GitHub Profile" />
                </Link>
            </ParallaxLayer>
        </Parallax>
    </div>
    );
}
