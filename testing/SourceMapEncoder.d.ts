import type * as SDK from '../core/sdk/sdk.js';
export declare function encodeVlq(n: number): string;
export declare function encodeVlqList(list: number[]): string;
export declare function encodeSourceMap(textMap: string[], sourceRoot?: string): SDK.SourceMap.SourceMapV3Object;
export declare class OriginalScopeBuilder {
    #private;
    start(line: number, column: number, kind: SDK.SourceMapScopes.ScopeKind, name?: number, variables?: number[]): this;
    end(line: number, column: number): this;
    build(): string;
}
