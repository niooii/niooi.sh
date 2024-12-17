"use client"
import React, { useEffect, useRef, useState } from "react";

class Command {
    readonly name: string;
    // the input string will never contain the command name
    readonly commandHandler: (input: string, ctx: ShellContext) => number;

    constructor(name: string, commandHandler: (input: string, ctx: ShellContext) => number) {
        this.name = name;
        this.commandHandler = commandHandler;
    }
}

const builtIns: Command[] = [
    new Command(
        "help",
        (input, ctx) => {
            ctx.printLn("'help' => get help on commands");
            ctx.printLn("'clear' => clear terminal");
            ctx.printLn("'echo' => echos text to terminal");

            return 0;
        }
    ),
    new Command(
        "clear",
        (input, ctx) => {
            ctx.clearHistory();

            return 0;
        }
    ),
    new Command(
        "echo",
        (input, ctx) => {
            ctx.printLn(input);

            return 0;
        }
    ),
    new Command(
        "cd",
        (input, ctx) => {
            ctx.printLn("...");

            return 0;
        }
    ),
    new Command(
        "ls",
        (input, ctx) => {
            ctx.printLn("...");

            return 0;
        }
    ),
];

class ShellContext {
    private history: string[];
    private inputHistory: string[];
    private historyIdx: number
    private cmds: Map<string, Command>;
    private updateState: () => void;

    constructor(commands: Command[], updateState: () => void) {
        this.history = [];
        this.inputHistory = [];
        this.historyIdx = 0;
        this.cmds = new Map(
            builtIns.concat(commands).map((c) => [c.name, c])
        )
        this.updateState = updateState;
    }

    public printLn(s: string) {
        this.history.push(s);
    }

    public getHistory(): string[] {
        return this.history;
    }

    public clearHistory() {
        this.history = [];
    }

    // Retrieves the next older input from the user relative to it's previous call. Resets on every interpret().
    // Returns the oldest if there is nothing more.
    public nextOlderInputHistory(): string {
        if (this.inputHistory.length === 0)
            return "";
        this.historyIdx = --this.historyIdx < 0 ? 0 : this.historyIdx; 
        return this.inputHistory[this.historyIdx];
    }

    // Retrieves the next newer input from the user relative to it's previous call. Resets on every interpret().
    // Returns the newest if there is nothing more.
    public nextNewerInputHistory(): string {
        if (this.inputHistory.length === 0)
            return "";
        this.historyIdx = ++this.historyIdx >= this.inputHistory.length ? this.inputHistory.length - 1 : this.historyIdx; 
        return this.inputHistory[this.historyIdx];
    }

    // actually does stuff w user input
    public interpret(userInput: string) {
        // only add if no immediate dup
        if (this.inputHistory[this.inputHistory.length - 1] !== userInput)
            this.inputHistory.push(userInput);

        let splitInput = userInput.split(" ");
        let cmdName: string | undefined = userInput.length == 0 ? undefined : splitInput[0];
        if (cmdName !== undefined) {
            let cmd = this.cmds.get(cmdName);
            if (cmd === undefined) {
                this.printLn("Unknown command. Try 'help'.");
            } else {
                this.historyIdx = this.inputHistory.length;
                cmd.commandHandler(splitInput.slice(1).join(" "), this);
            }
        }

        this.historyIdx = this.inputHistory.length;
        this.updateState();
    };
}

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
    const [showCursor, setShowCursor] = useState<boolean>(true);
    const [_, setState] = useState<boolean>(true);
    const ctxRef = useRef<ShellContext>(new ShellContext(commands, () => {setState(p => !p);}));
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

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        const ctx: ShellContext = ctxRef.current;
        switch (e.key) {
            case "Enter": {
                ctx.printLn(`${promptRef.current} ${input}`);
                ctx.interpret(input);
                setInput("");
                setCursorPosition(0);
                break;
            }
            case "ArrowUp": {
                let str = ctx.nextOlderInputHistory();
                inputRef.current!.value = str;
                setInput(str);
                setCursorPosition(inputRef.current!.selectionStart || 0);
                break;
            }
            case "ArrowDown": {
                let str = ctx.nextNewerInputHistory();
                inputRef.current!.value = str;
                setInput(str);
                setCursorPosition(inputRef.current!.selectionStart || 0);
                break;
            }
            case "ArrowLeft": 
            case "ArrowRight": {
                setCursorPosition(inputRef.current!.selectionStart || 0);
                break;
            }
        }
    };

    return (
        <div
            className="w-full h-96 bg-black text-white-500 p-4 font-mono text-sm overflow-y-auto rounded"
            onClick={handleShellClick}
        >
            <div className="space-y-0">
                {ctxRef.current.getHistory().map((line, index) => (
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
                        onKeyDown={handleKeyDown}
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