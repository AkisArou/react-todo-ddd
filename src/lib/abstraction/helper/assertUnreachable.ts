export function assertUnreachable(x: never): never {
    throw new Error("Unreachable case in exhaustive switch");
}
