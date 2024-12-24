import { Path, FileSystem, FileType, FileNode } from "./filesystem";

export class Command {
    readonly name: string;
    readonly autoComplete: ShellAutoCompleteType;
    // the input string will never contain the command name
    readonly commandHandler: (input: string, ctx: ShellContext) => number;
    
    constructor(name: string, commandHandler: (input: string, ctx: ShellContext) => number, autoComplete: ShellAutoCompleteType = ShellAutoCompleteType.Nothing) {
        this.name = name;
        this.commandHandler = commandHandler;
        this.autoComplete = autoComplete;
    }
}

export enum ShellAutoCompleteType {
    Everything,
    Files,
    Directories,
    ExecutablesOnly,
    ExecutablesAndDirectories,
    Nothing
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
        },
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
        },
        ShellAutoCompleteType.Directories
    ),
    new Command(
        "ls",
        (input, ctx) => {
            // TODO! argument to list path of another dir
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
        },
        ShellAutoCompleteType.Directories
    ),
];

export class ShellContext {
    private history: string[];
    private inputHistory: string[];
    private historyIdx: number
    private cmds: Map<string, Command>;
    private fs: FileSystem;
    private cwd: Path;
    private cwdNode: FileNode;
    private updateState: () => void;

    constructor(cwd: Path, fs: FileSystem, commands: Command[], updateState: () => void) {
        this.fs = fs;
        this.cwd = cwd;
        let node = fs.getNode(this.cwd);
        console.log("CONSTRUCTOR CALLED.");

        if (node === undefined) {
            throw new Error(`The path '${this.cwd.toString()}' doesn't exist.`);
        }
        if (node!.type !== FileType.Directory) {
            throw new Error(`The path '${this.cwd.toString()}' isn't a directory.`);
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

    // Resolves a path relative to the current working directory
    // Not guarenteed to exist in the filesystem.
    public resolveRelativePath(relPath: Path): Path {
        const p = this.cwd.clone();
        p.push(relPath);
        return p;
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
                // maybe an executable file
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