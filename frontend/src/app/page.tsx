"use client"

import Shell from "@/components/shell";
import Mandelbrot from "@/components/vfx/mandelbrot";
import Winter from "@/components/vfx/winter";
import { useSmoothMouse } from "@/hooks/smooth_mouse";
import { FileSystem, Path } from "@/lib/filesystem";
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

    return (
        <div className="min-h-screen bg-black">
            <Shell fs={fsRef.current} />
            <Winter spawnRate={10}></Winter>
            <Mandelbrot width={600} height={600}></Mandelbrot>
            <h1>MOVE MOUSE</h1>
            <h1 className="text-center text-7xl">HI CHAT</h1>
        </div>
    );
}
