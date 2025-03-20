"use client"

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
            <ParallaxLayer offset={1} factor={3} speed={1} style={{ backgroundColor: '#805E73' }} />
            <ParallaxLayer offset={3} speed={1} style={{ backgroundColor: '#87BCDE' }} />

            <ParallaxLayer
            offset={0}
            speed={0}
            factor={3}
            style={{
                backgroundImage: "stars.svg",
                backgroundSize: 'cover',
            }}
            />

            <ParallaxLayer 
                offset={1.3} 
                speed={-0.3} 
                style={{ width: '10%', height: '5%', marginLeft: '70%', cursor: "pointer", zIndex: 99 }}  
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
                offset={3.3}
                speed={-0.4}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    pointerEvents: 'none',
                }}>
                <img src={"akaricough.png"} style={{ width: '30%' }} />
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
                        YO dfdfdf asfasfsafsa
                    </h1>
                </div>
            </ParallaxLayer>

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
                    className="text-center text-7xl font-semibold text-black">
                    SOME STUFF IVE DONE..
                </h1>
            </ParallaxLayer>

            <ParallaxLayer
                offset={2}
                speed={-0}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
                onClick={() => parallax.current.scrollTo(0)}
                >
                {/* <img src={"file.svg"} style={{ width: '40%' }} /> */}
            </ParallaxLayer>
        </Parallax>
    </div>
    );
}
