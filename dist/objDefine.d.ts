export declare function stringify(config: any): string;
export interface SecretGitSource {
    username?: string;
    password?: string;
}
export interface SecretConfig {
    source?: SecretGitSource;
    target?: SecretGitSource;
}
export declare const defaultSecretConfig: SecretConfig;
export declare function parseSecretConfig(jsonStr: string): SecretConfig | null;
export interface GitSource extends SecretGitSource {
    url: string;
}
export interface RepositoryItem {
    source: GitSource;
    target: GitSource;
    not_check_all_branch: boolean;
    force: boolean;
}
export interface VariableConfig {
    repository_list: RepositoryItem[];
}
export declare const defaultVariableConfig: VariableConfig;
export declare function parseVariableConfig(jsonStr: string): VariableConfig | null;
