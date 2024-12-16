"use client"
import React, { useEffect, useRef, useState } from "react";

class Command {

}

const builtIns: Command[] = [
    new Command(),
];

type ShellProps = {
    currDir?: string;
    commands?: Command[];
};

// TODO! something...
const user: string = "visitor";
const host: string = "niooi.sh";

const Shell = ({ currDir = "/", commands = [] }: ShellProps) => {
    const [input, setInput] = useState<string>("");
    const [cursorPosition, setCursorPosition] = useState<number>(0);
    const [history, setHistory] = useState<string[]>([]);
    const [showCursor, setShowCursor] = useState<boolean>(true);
    const inputRef = useRef<HTMLInputElement>(null);
    const dirRef = useRef<string>(currDir);
    const promptRef = useRef<string>(`[${user}@${host} ${currDir}]$`);

    useEffect(() => {
        const cursorInterval = setInterval(() => {
            setShowCursor(prev => !prev);
        }, 530);

        return () => clearInterval(cursorInterval);
    }, []);

    const handleShellClick = () => {
        inputRef.current?.focus();
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInput(e.target.value);
        setCursorPosition(e.target.selectionStart || 0);
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            setHistory(prev => [...prev, `${promptRef.current} ${input}`]);
            setInput("");
            setCursorPosition(0);
        }
    };

    return (
        <div
            className="w-full h-96 bg-black text-white-500 p-4 font-mono text-sm overflow-y-auto rounded"
            onClick={handleShellClick}
        >
            <div className="space-y-0">
                {history.map((line, index) => (
                    <div key={index}>{line}</div>
                ))}
            </div>
            <div className="flex relative whitespace-pre">
                {/* THIS SPACE IS IMPORTANT!!!!11 */}
                <span>{`${promptRef.current} `}</span>
                <div className="relative flex-1">
                    <input
                        ref={inputRef}
                        type="text"
                        value={input}
                        onChange={handleInputChange}
                        onKeyPress={handleKeyPress}
                        className="w-full bg-transparent border-none outline-none caret-transparent"
                        autoFocus
                    />
                    <div
                        className={`absolute top-0 h-4 w-0.5 bg-white transition-opacity ${showCursor ? "opacity-100" : "opacity-0"}`}
                        style={{
                            left: `${input.substring(0, cursorPosition).length}ch`
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

export default Shell;