import { FileSystem, Path } from "./filesystem";

console.log("test begin");

let path1 = new Path("/");
console.log(path1.name());
console.log(path1.parent());

path1.push(new Path("type/shit//////"));
console.log(path1.name());
console.log(path1.parent());