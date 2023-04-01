////// -----------------------------------------------------------------------------------------------------------------
/*//// -----------------------------------------------------------------------------------------------------------------

This file is an "Ambient declarations file". The types defined here are available globally.
More info here: https://stackoverflow.com/a/73389225/985454

Don't use `import` and `export` in this file directly! It breaks ambience.
To import external types in an ambient declarations file (this file) use the following:

*//**
 * @example
 * declare type React = import('react')
 *//*

To contribute ambient declarations from any file, even non-ambient ones, use this:

*//**
 * @example
 * declare global {
 *   interface Window {
 *     ethereum: any
 *   }
 * }
 *//*

/*//// -----------------------------------------------------------------------------------------------------------------
////// -----------------------------------------------------------------------------------------------------------------
// Ripped off straight from console.re source, licenses apply
// https://github.com/kurdin/console-remote/blob/main/index.d.ts
export {}

type ConsoleReMethods =
    | 'log'
    | 'error'
    | 'info'
    | 'warn'
    | 'debug'
    | 'count'
    | 'now'
    | 'time'
    | 'test'
    | 'assert'
    | 'type'
    | 'timeEnd'
    | 'trace'
    | 'size'
    | 'css'
    | 'mark'
    | 'clear'

type ConsoleReShortCutMethods =
    | 'l'
    | 'e'
    | 'i'
    | 'w'
    | 'd'
    | 'c'
    | 'n'
    | 'ti'
    | 'ts'
    | 'a'
    | 't'
    | 'te'
    | 'tr'
    | 's'
    | 'cs'
    | 'm'
    | 'cl'

type ConsoleReConnect = {
    server?: string
    channel: string
    disableDefaultConsoleOutput?: boolean
    redirectDefaultConsoleToRemote?: boolean
}

export interface ConsoleRe {
    connect: (options: ConsoleReConnect) => void
}

declare module NodeJS {
    interface Global {
        relog: (...message: any) => void
        re: {
            [key in ConsoleReMethods]: (...message: any) => void
        }
    }
}

declare global {
    interface Window {
        relog: (...message: any) => void
        re: {
            [key in ConsoleReMethods | ConsoleReShortCutMethods]: (...message: any) => void
        }
    }

    interface Console {
        re: {
            [key in ConsoleReMethods | ConsoleReShortCutMethods]: (...message: any) => void
        }
    }
}

declare var relog: (...message: any) => void
declare var re: {
    [key in ConsoleReMethods | ConsoleReShortCutMethods]: (...message: any) => void
}

declare const consolere: ConsoleRe
export as namespace consolere
export default consolere