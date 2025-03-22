"use client"
import { FileNode, FileSystem, FileType, Path } from "@/lib/filesystem";
import { Command, ShellContext, ShellAutoCompleteType } from "@/lib/shell";
import React, { useEffect, useRef, useState } from "react";

type ShellProps = {
    fs?: FileSystem;
    cwd?: Path;
    commands?: Command[];
};

interface AutoCompleteState {
    currCmd: Command | undefined;
    currOptionIdx: number;
    prevPartialInput: string;
    optionsArray: string[];
    currDir: Path | undefined;
};

// millis
const cursorBlinkSpeed = 530;

const defaultFs = new FileSystem();
const defaultCwd = new Path("/");

// TODO! something...
const user: string = "visitor";
const host: string = "niooi.sh";
const Shell = ({fs, cwd, commands }: ShellProps) => {
    const [input, setInput] = useState<string>("");
    const [cursorPosition, setCursorPosition] = useState<number>(0);
    const [showCursor, setShowCursor] = useState<boolean>(true);
    const cursorIntervalRef = useRef<NodeJS.Timeout | undefined>(undefined);
    const [_, setState] = useState<boolean>(true);

    cwd = cwd || defaultCwd;
    fs = fs || defaultFs;

    const ctxRef = useRef<ShellContext>(new ShellContext(
        cwd,
        fs,
        commands || [],
        () => {setState(p => !p);}),
    );
    const inputRef = useRef<HTMLInputElement>(null);
    const isCurrentInputFromUser = useRef<boolean>(false);
    const promptRef = useRef<string>(`[${user}@${host} ${cwd.toString()}]$`);
    const updatePrompt = () => {
        promptRef.current = `[${user}@${host} ${ctxRef.current.getCwd().toString()}]$`;
    }
    const autoCompleteStateRef = useRef<AutoCompleteState>({
        currCmd: undefined,
        currOptionIdx: 0,
        prevPartialInput: "",
        optionsArray: [],
        currDir: undefined,
    });

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
        setInputText(e.target.value);
        isCurrentInputFromUser.current = true;
        resetCursorBlinkState();
    };

    const getAutoCompletedString = () => {
        const ctx: ShellContext = ctxRef.current;
        if (input.length === 0)
            return;

        const splitInput = input.split(" ");
        let cmd;
        
        let partialInput = "";
        let autoCompleteType = ShellAutoCompleteType.Nothing;
        if (splitInput.length > 1) {
            // we got a command with inputs
            partialInput = splitInput[splitInput.length - 1];
            splitInput.pop();
            cmd = ctx.getCommand(splitInput[0]);
            if (cmd === undefined || cmd.autoComplete === undefined || cmd.autoComplete === ShellAutoCompleteType.Nothing)
                return;
            autoCompleteType = cmd.autoComplete;
        } else if (splitInput[0].length !== 0) {
            // probably exec a file
            autoCompleteType = ShellAutoCompleteType.ExecutablesAndDirectories;
        }

        let cdPath = ctx.resolveRelativePath(new Path(partialInput.length === 0 ? "./" : partialInput));
        let currDir = cdPath.parent();
        console.log("PATH: " + cdPath);
        currDir = currDir === undefined ? new Path("/") : currDir;
        console.log(`SEARCHING ${currDir}`);
        
        let acState = autoCompleteStateRef.current;
        let reload: boolean = false;
        if (isCurrentInputFromUser.current) {
            acState.prevPartialInput = partialInput;
            reload = true;
        }
        // update if the command changed, if the search directory was never initialized
        // or if the search directory changed (i love explaining spaghetti code)
        if (reload
            || acState.currCmd !== cmd 
            || acState.currDir === undefined 
            || !currDir.equals(acState.currDir)
        ) {
            acState.currCmd = cmd;
            acState.currDir = currDir;
            const currNode = fs.getNode(currDir);
            if (currNode === undefined)
                return;
            // update the entries and reset the idx
            acState.currOptionIdx = 0;
            const lastSlashIdx = acState.prevPartialInput.lastIndexOf("/");
            const filterCriteria = acState.prevPartialInput.substring(lastSlashIdx + 1);
            console.log("FILTERING BY: " + filterCriteria);
            switch (autoCompleteType) {
                // TODO! filter by if the users partial input not just cycling every opt
                case ShellAutoCompleteType.Files: {
                    acState.optionsArray = Array.from(
                        currNode.children!.entries().filter(
                            ([name, node]) => node.type === FileType.File && name.startsWith(filterCriteria)
                        ).map(([name, _]) => name)
                    );
                    break;
                }
                case ShellAutoCompleteType.Directories: {
                    acState.optionsArray = Array.from(
                        currNode.children!.entries().filter(
                            ([name, node]) => node.type === FileType.Directory && name.startsWith(filterCriteria)
                        ).map(([name, _]) => name)
                    );
                    break;
                }
                case ShellAutoCompleteType.ExecutablesOnly: {
                    acState.optionsArray = Array.from(
                        currNode.children!.entries().filter(
                            ([name, node]) => node.executable && name.startsWith(filterCriteria)
                        ).map(([name, _]) => name)
                    );
                    break;
                }
                case ShellAutoCompleteType.Everything: {
                    acState.optionsArray = Array.from(currNode.children!.entries().filter
                    (([name, _]) => name.startsWith(filterCriteria)).map(([name, _]) => name));
                    break;
                }
                case ShellAutoCompleteType.ExecutablesAndDirectories: {
                    currNode.children!.entries().filter(
                        ([name, node]) => (node.executable || node.type === FileType.Directory) && name.startsWith(filterCriteria)
                    ).map(([name, _]) => name)
                }
            }
        }
        // now everythign should be up to date, return final string
        const lastSlashIdx = partialInput.lastIndexOf("/");
        const targetName = acState.optionsArray[acState.currOptionIdx];
        if (acState.optionsArray.length === 0) 
            return;
            
        console.log("OPTIONS: " + acState.optionsArray);
        acState.currOptionIdx = (acState.currOptionIdx + 1) % acState.optionsArray.length;
        if (lastSlashIdx !== -1) {
            splitInput.push(partialInput.substring(0, lastSlashIdx).concat(`/${targetName}`));
        } else {
            splitInput.push(targetName);
        }
        return splitInput.join(" ");
    }

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
                const str = getAutoCompletedString();
                console.log("GOT STR: " + str);
                if (str !== undefined) {
                    setInputText(str);
                    isCurrentInputFromUser.current = false;
                }
                break;
            }
            case "ArrowUp": {
                e.preventDefault();
                let str = ctx.nextOlderInputHistory();
                setInputText(str);
                isCurrentInputFromUser.current = false;
                break;
            }
            case "ArrowDown": {
                e.preventDefault();
                let str = ctx.nextNewerInputHistory();
                setInputText(str);
                isCurrentInputFromUser.current = false;
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