import * as core from '@actions/core'
import * as exec from '@actions/exec'
import * as fs from 'fs'
import * as path from 'path'
import * as objDefine from './objDefine.js'

/**
 * The main function for the action.
 *
 * @returns Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  try {
    // 密文参数
    const secretConfig = objDefine.parseSecretConfig(
      core.getInput('secret_config')
    )
    if (!!!secretConfig) {
      throw new Error('secretConfig not exists')
    }
    // 明文参数
    const variableConfig = objDefine.parseVariableConfig(
      core.getInput('variable_config')
    )
    if (!!!variableConfig) {
      throw new Error('variableConfig not exists')
    }

    core.info(`variableConfig: ${objDefine.stringify(variableConfig)}`)

    const repository_list = variableConfig.repository_list
    if (!!!repository_list) {
      throw new Error('repository not exists')
    }

    // 检查是否有重复的 URL
    const sourceRepositoryUrlList = repository_list.map((repository) => {
      return repository.source.url
    })
    if (!!!sourceRepositoryUrlList) {
      throw new Error('source repository list is empty')
    }
    const uniqueSourceUrls = new Set(sourceRepositoryUrlList)
    if (uniqueSourceUrls.size !== sourceRepositoryUrlList.length) {
      throw new Error('Duplicate URLs found in source repository list.')
    }

    // 并发地同步每对仓库
    await Promise.allSettled(
      repository_list.map(async (repository) => {
        const sourceUrl = repository.source.url
        const targetUrl = repository.target.url
        // const repoName = path.basename(sourceUrl, '.git') // 获取仓库名
        const cloneDirName = sourceUrl.replace(/\.|:|\//g, '-')
        const cloneDir = path.join(process.cwd(), cloneDirName) // 定义克隆目录

        // 检查 cloneDir 是否存在
        if (fs.existsSync(cloneDir)) {
          core.info(
            `Directory ${cloneDir} already exists. Skipping synchronization for ${sourceUrl}.`
          )
          return
        }

        // 克隆源仓库
        let finalSourceUrl = sourceUrl
        // 得到用户名密码
        let sourceUsername = ''
        let sourcePassword = ''
        if (!!repository.source.username && !!repository.source.password) {
          sourceUsername = repository.source.username
          sourcePassword = repository.source.password
        } else if (
          !!secretConfig.source?.username &&
          !!secretConfig.source?.password
        ) {
          sourceUsername = secretConfig.source?.username
          sourcePassword = secretConfig.source?.password
        }
        if (!!sourceUsername && !!sourcePassword) {
          // 如果提供了用户名和密码，则将其添加到URL中
          finalSourceUrl = sourceUrl.replace(
            'https://',
            `https://${sourceUsername}:${sourcePassword}@`
          )
        }
        await exec.exec('git', ['clone', finalSourceUrl, cloneDir], {
          env: {
            ...process.env,
            GIT_ASKPASS: 'echo', // 禁用密码提示
            GIT_USERNAME: sourceUsername,
            GIT_PASSWORD: sourcePassword
          }
        })

        // 检出所有分支
        if (!repository.not_check_all_branch) {
          await exec.exec('git', ['fetch', '--all'], { cwd: cloneDir }) // 获取所有分支
          const branches = await exec.getExecOutput('git', ['branch', '-r'], {
            cwd: cloneDir
          }) // 获取远程分支列表
          const branchList = branches.stdout
            .replace(/\r\n/g, '\n') // 先统一替换为 \n
            .split('\n')
            .filter((branch) => branch) // 处理分支列表

          for (let branch of branchList) {
            // branch去除首尾空格
            branch = branch.trim() // 去除首尾空格
            // 如果不是origin仓库的分支，跳过
            if (!branch.startsWith('origin/')) {
              core.info(`Skipping branch ${branch} as it is not from origin.`)
              continue
            }
            const branchName = branch.trim().replace('origin/', '') // 获取分支名称
            // 如果分支名以HEAD开头的字符串或有空格，跳过
            if (branchName.startsWith('HEAD') || branchName.includes(' ')) {
              core.info(
                `Skipping branch ${branchName} as it starts with HEAD or contains spaces.`
              )
              continue
            }
            // 检查分支名是否与本地文件名冲突
            if (fs.existsSync(path.join(cloneDir, branchName))) {
              core.info(
                `Skipping branch ${branchName} as it conflicts with a local file name.`
              )
              continue
            }
            await exec.exec('git', ['checkout', branchName], { cwd: cloneDir }) // 检出每个分支
          }
        }

        // 设置目标仓库的远程URL
        let finalTargetUrl = targetUrl
        // 得到用户名密码
        let targetUsername = ''
        let targetPassword = ''
        if (!!repository.target.username && !!repository.target.password) {
          targetUsername = repository.target.username
          targetPassword = repository.target.password
        } else if (
          !!secretConfig.target?.username &&
          !!secretConfig.target?.password
        ) {
          targetUsername = secretConfig.target?.username
          targetPassword = secretConfig.target?.password
        }
        if (!!targetUsername && !!targetPassword) {
          // 如果提供了用户名和密码，则将其添加到URL中
          finalTargetUrl = targetUrl.replace(
            'https://',
            `https://${targetUsername}:${targetPassword}@`
          )
        }
        await exec.exec(
          'git',
          ['remote', 'set-url', 'origin', finalTargetUrl],
          { cwd: cloneDir }
        )

        // 推送仓库参数
        const pushRepositoryParamList = ['push', '--all']
        if (repository.force) {
          pushRepositoryParamList.push('--force')
        }

        // 推送所有分支到目标仓库
        await exec.exec('git', pushRepositoryParamList, {
          cwd: cloneDir,
          env: {
            ...process.env,
            GIT_ASKPASS: 'echo',
            GIT_USERNAME: targetUsername,
            GIT_PASSWORD: targetPassword
          }
        })

        // 推送tag参数
        const pushTagParamList = ['push', '--tags']
        if (repository.force) {
          pushTagParamList.push('--force')
        }

        // 推送所有标签到目标仓库
        await exec.exec('git', pushTagParamList, {
          cwd: cloneDir,
          env: {
            ...process.env,
            GIT_ASKPASS: 'echo',
            GIT_USERNAME: targetUsername,
            GIT_PASSWORD: targetPassword
          }
        })

        // 删除克隆的目录以清理空间
        fs.rmSync(cloneDir, { recursive: true, force: true })
      })
    )

    // 如果所有仓库同步成功，记录信息
    core.info('All repositories have been synchronized successfully.')
  } catch (error) {
    // 如果发生错误，设置工作流失败
    core.setFailed(`Action failed with error: ${error}`)
  }
}
