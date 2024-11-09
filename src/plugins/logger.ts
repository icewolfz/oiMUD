
export enum Log {
    None = 0,
    Html = 1,
    Text = 2,
    Raw = 4
}

export interface LogOptions {
    path?: string;
    offline?: boolean;
    gagged?: boolean;
    enabled?: boolean;
    unique?: boolean;
    prepend?: boolean;
    name?: string;
    what?: Log;
    debug?: boolean;
}
