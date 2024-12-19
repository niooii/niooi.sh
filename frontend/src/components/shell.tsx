"use client"
import { FileNode, FileSystem, FileType, Path } from "@/lib/filesystem";
import React, { useEffect, useRef, useState } from "react";

class Command {
    readonly name: string;
    readonly autoComplete: ShellAutoCompleteType;
    // the input string will never contain the command name
    readonly commandHandler: (input: string, ctx: ShellContext) => number;

    constructor(name: string, commandHandler: (input: string, ctx: ShellContext) => number, autoComplete: ShellAutoCompleteType = ShellAutoCompleteType.None) {
        this.name = name;
        this.commandHandler = commandHandler;
        this.autoComplete = autoComplete;
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
            let result = ctx.cd(new Path(input));
            if (result !== undefined)
                ctx.printLn(result);

            return 0;
        }
    ),
    new Command(
        "ls",
        (input, ctx) => {
            ctx.printLn("");
            let cwd = ctx.getCwdNode();
            cwd.children!.entries().forEach(([name, node]) => {
                let icon = "";
                if (node.type === FileType.Directory) {
                    icon = "📁";
                } else {
                    if (node.executable)
                        icon = "*";
                    else
                        icon = "🗎";
                }
                ctx.print(`${icon}${name} `)
            });
            
            return 0;
        }
    ),
];


const defaultFs = new FileSystem();
const defaultCwd = new Path("/");

export enum ShellAutoCompleteType {
    Everything,
    Files,
    Directories,
    ExecutablesOnly,
    None
}

class ShellContext {
    private history: string[];
    private inputHistory: string[];
    private historyIdx: number
    private cmds: Map<string, Command>;
    private fs: FileSystem;
    private cwd: Path;
    private cwdNode: FileNode;
    private updateState: () => void;

    constructor(commands: Command[], fs: FileSystem, cwd: Path, updateState: () => void) {
        this.fs = fs;
        this.cwd = cwd;
        let node = fs.getNode(this.cwd);
        console.log("CONSTRUCTOR CALLED.");

        const loadDefaultNode = () => {
            this.cwd = defaultCwd;
            let node = fs.getNode(this.cwd);
            if (node === undefined || node.type !== FileType.Directory) {
                throw new Error("Default path is bad, good luck buddy.");
            }
        }
        if (node === undefined) {
            console.warn(`The path '${this.cwd.toString()}' doesn't exist, resorting to default directory: '${defaultCwd.toString()}'`);
            loadDefaultNode();
        }
        if (node!.type !== FileType.Directory) {
            console.warn(`The path '${this.cwd.toString()}' isn't a directory, resorting to default directory: '${defaultCwd.toString()}'`);
            loadDefaultNode();
        }

        this.cwdNode = node!;
        this.history = [];
        this.inputHistory = [];
        this.historyIdx = 0;
        this.cmds = new Map(
            builtIns.concat(commands).map((c) => [c.name, c])
        )
        this.updateState = updateState;
    }

    public getCommand(name: string): Readonly<Command> | undefined {
        return this.cmds.get(name);
    }

    public getFileSystem(): FileSystem {
        return this.fs;
    }

    public getCwdNode(): Readonly<FileNode> {
        return this.cwdNode;
    }

    public cd(path: Path): string | undefined {
        let newPath: Path;

        if (path.isAbsolute()) {
            newPath = path.clone();
        } else {
            newPath = this.cwd.clone();
            newPath.push(path);
        }

        const node = this.fs.getNode(newPath);
        if (node === undefined) {
            console.log(this.fs);
            return `Could not find the path '${newPath.toString()}'`;
        }
        if (node.type !== FileType.Directory) {
            return `'${newPath.toString()}' is not a directory`;
        }

        this.cwd.set(newPath);
        this.cwdNode = node;
        this.updateState();
    }

    public printLn(s: string) {
        this.history.push(s);
    }

    public print(s: string) {
        this.history[this.history.length - 1] = this.history[this.history.length - 1].concat(s);
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

    public getCwd(): Path {
        return this.cwd;
    }
}

type ShellProps = {
    fs?: FileSystem;
    cwd?: Path;
    commands?: Command[];
};

// millis
const cursorBlinkSpeed = 530;

// TODO! something...
const user: string = "visitor";
const host: string = "niooi.sh";
const Shell = ({ fs = defaultFs, cwd = defaultCwd, commands = [] }: ShellProps) => {
    const [input, setInput] = useState<string>("");
    const [cursorPosition, setCursorPosition] = useState<number>(0);
    const [showCursor, setShowCursor] = useState<boolean>(true);
    const cursorIntervalRef = useRef<NodeJS.Timeout | undefined>(undefined);
    const [_, setState] = useState<boolean>(true);
    const ctxRef = useRef<ShellContext>(new ShellContext(
        commands, 
        fs,
        cwd,
        // dumb hack to update state eww
        () => {setState(p => !p);})
    );
    const inputRef = useRef<HTMLInputElement>(null);
    const promptRef = useRef<string>(`[${user}@${host} ${cwd.toString()}]$`);
    const updatePrompt = () => {
        promptRef.current = `[${user}@${host} ${ctxRef.current.getCwd().toString()}]$`;
    }

    const handleShellClick = () => {
        inputRef.current?.focus();
    };

    const setInputText = (str: string) => {
        inputRef.current!.value = str;
        setInput(str);
        setCursorPosition(str.length);
        inputRef.current!.focus();
        inputRef.current!.setSelectionRange(str.length, str.length);
    }

    useEffect(() => {
        cursorIntervalRef.current = setInterval(() => {
            setShowCursor(prev => !prev);
        }, cursorBlinkSpeed);

        return () => {
            if (cursorIntervalRef.current) {
                clearInterval(cursorIntervalRef.current);
            }
        };
    });

    const resetCursorBlinkState = () => {
        setShowCursor(true);
        clearInterval(cursorIntervalRef.current);
        cursorIntervalRef.current = setInterval(() => {
            setShowCursor(prev => !prev);
        }, cursorBlinkSpeed);
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInput(e.target.value);
        setCursorPosition(e.target.selectionStart || 0);
        resetCursorBlinkState();
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        const ctx: ShellContext = ctxRef.current;
        switch (e.key) {
            case "Enter": {
                ctx.printLn(`${promptRef.current} ${input}`);
                ctx.interpret(input);
                setInput("");
                setCursorPosition(0);
                updatePrompt();
                break;
            }
            case "Tab": {
                e.preventDefault();
                // quick auto completion for cd and ls
                if (input.length === 0)
                    break;
                
                // special case for opening files
                if (input.startsWith("./")) {
                    
                    break;
                }

                const cmdName = input.split(" ")[0];
                const cmd = ctx.getCommand(cmdName);
                if (cmd === undefined)
                    break;

                switch (cmd.autoComplete) {
                    // TODO!
                    case ShellAutoCompleteType.Files: {
                        
                        break;
                    }
                    case ShellAutoCompleteType.Directories: {
                        
                        break;
                    }
                    case ShellAutoCompleteType.ExecutablesOnly: {
                        
                        break;
                    }
                    case ShellAutoCompleteType.Everything: {
                        
                        break;
                    }
                }

                break;
            }
            case "ArrowUp": {
                e.preventDefault();
                let str = ctx.nextOlderInputHistory();
                setInputText(str);
                break;
            }
            case "ArrowDown": {
                e.preventDefault();
                let str = ctx.nextNewerInputHistory();
                setInputText(str);
                break;
            }
            case "ArrowLeft": {
                setCursorPosition(cursorPosition - 1 < 0 ? 0 : cursorPosition - 1);
                resetCursorBlinkState();
                break;
            }
            case "ArrowRight": {
                setCursorPosition(cursorPosition + 1 > inputRef.current!.value.length ? inputRef.current!.value.length : cursorPosition + 1);
                resetCursorBlinkState();
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