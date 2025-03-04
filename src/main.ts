import * as core from '@actions/core'
import * as exec from '@actions/exec'

/**
 * The main function for the action.
 *
 * @returns Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  try {
    // 从 secrets 中获取源仓库信息
    const sourceRepositoryUrl = core.getInput('source_repository_url', { required: true })
    const sourceRepositoryUsername = core.getInput('source_repository_username')
    const sourceRepositoryPassword = core.getInput('source_repository_password')

    // 从 secrets 中获取目标仓库信息
    const targetRepositoryUrl = core.getInput('target_repository_url', { required: true })
    const targetRepositoryUsername = core.getInput('target_repository_username')
    const targetRepositoryPassword = core.getInput('target_repository_password')

    // 克隆源仓库
    let cloneCommand = `git clone ${sourceRepositoryUrl} source-repo`
    if (sourceRepositoryUsername && sourceRepositoryPassword) {
      const authSourceUrl = sourceRepositoryUrl.replace('https://', `https://${sourceRepositoryUsername}:${sourceRepositoryPassword}@`)
      cloneCommand = `git clone ${authSourceUrl} source-repo`
    }
    await exec.exec(cloneCommand)

    // 进入源仓库目录
    process.chdir('source-repo')

    // 添加目标仓库为远程
    let remoteAddCommand = `git remote add target ${targetRepositoryUrl}`
    if (targetRepositoryUsername && targetRepositoryPassword) {
      const authTargetUrl = targetRepositoryUrl.replace('https://', `https://${targetRepositoryUsername}:${targetRepositoryPassword}@`)
      remoteAddCommand = `git remote add target ${authTargetUrl}`
    }
    await exec.exec(remoteAddCommand)

    // 推送到目标仓库
    await exec.exec('git push target --all')
    await exec.exec('git push target --tags')

    core.info('同步完成')
  } catch (error) {
    // Fail the workflow run if an error occurs
    core.setFailed(`Action failed with error: ${error}`)
  }
}
