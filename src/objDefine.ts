export function stringify(config: any): string {
  return JSON.stringify(config, null, 2)
}

// -----------------------------------------------------------------------------------------------

export interface SecretGitSource {
  username?: string
  password?: string
}

export interface SecretConfig {
  source?: SecretGitSource
  target?: SecretGitSource
}

export const defaultSecretConfig: SecretConfig = {
  source: {
    username: '',
    password: ''
  },
  target: {
    username: '',
    password: ''
  }
}

export function parseSecretConfig(jsonStr: string): SecretConfig | null {
  try {
    const result = JSON.parse(jsonStr) as SecretConfig
    return result
  } catch (err) {
    throw new Error('JSON parse error')
  }
}

// -----------------------------------------------------------------------------------------------

// 类型定义
export interface GitSource extends SecretGitSource {
  url: string
}

export interface RepositoryItem {
  source: GitSource
  target: GitSource
  not_check_all_branch: boolean
  force: boolean
}

export interface VariableConfig {
  repository_list: RepositoryItem[]
}

// 空模板对象
export const defaultVariableConfig: VariableConfig = {
  repository_list: [
    {
      source: {
        url: '',
        username: '',
        password: ''
      },
      target: {
        url: '',
        username: '',
        password: ''
      },
      not_check_all_branch: false,
      force: false
    }
  ]
}

export function parseVariableConfig(jsonStr: string): VariableConfig | null {
  try {
    const result = JSON.parse(jsonStr) as VariableConfig
    return result
  } catch (err) {
    throw new Error('JSON parse error')
  }
}
