import * as core from '@actions/core'
import * as exec from '@actions/exec'
import * as fs from 'fs'
import * as path from 'path'

/**
 * The main function for the action.
 *
 * @returns Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  try {
    // 从变量中获取仓库URL列表
    const sourceRepositoryUrlList = core.getInput('source_repository_url_list').split('\n').filter(Boolean)
    const targetRepositoryUrlList = core.getInput('target_repository_url_list').split('\n').filter(Boolean)

    // 从秘密中获取用户名和密码
    const sourceUsername = core.getInput('source_repository_username')
    const sourcePassword = core.getInput('source_repository_password')
    const targetUsername = core.getInput('target_repository_username')
    const targetPassword = core.getInput('target_repository_password')

    if (sourceRepositoryUrlList.length !== targetRepositoryUrlList.length) {
      throw new Error('Source and target repository lists must have the same length.')
    }

    // 并发同步每对仓库
    await Promise.all(sourceRepositoryUrlList.map(async (sourceUrl, index) => {
      const targetUrl = targetRepositoryUrlList[index]
      const repoName = path.basename(sourceUrl, '.git')
      const cloneDir = path.join(process.cwd(), repoName)

      // 克隆源仓库
      await exec.exec('git', ['clone', sourceUrl, cloneDir], {
        env: {
          ...process.env,
          GIT_ASKPASS: 'echo',
          GIT_USERNAME: sourceUsername,
          GIT_PASSWORD: sourcePassword
        }
      })

      // 推送到目标仓库
      await exec.exec('git', ['remote', 'set-url', 'origin', targetUrl], { cwd: cloneDir })
      await exec.exec('git', ['push', '--all'], {
        cwd: cloneDir,
        env: {
          ...process.env,
          GIT_ASKPASS: 'echo',
          GIT_USERNAME: targetUsername,
          GIT_PASSWORD: targetPassword
        }
      })

      // 删除克隆的目录
      fs.rmSync(cloneDir, { recursive: true, force: true })
    }))

    core.info('All repositories have been synchronized successfully.')
  } catch (error) {
    // Fail the workflow run if an error occurs
    core.setFailed(`Action failed with error: ${error}`)
  }
}

run()
