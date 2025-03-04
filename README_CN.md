# 使用 TypeScript 创建 GitHub Action

[![GitHub Super-Linter](https://github.com/actions/typescript-action/actions/workflows/linter.yml/badge.svg)](https://github.com/super-linter/super-linter)
![CI](https://github.com/actions/typescript-action/actions/workflows/ci.yml/badge.svg)
[![Check dist/](https://github.com/actions/typescript-action/actions/workflows/check-dist.yml/badge.svg)](https://github.com/actions/typescript-action/actions/workflows/check-dist.yml)
[![CodeQL](https://github.com/actions/typescript-action/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/actions/typescript-action/actions/workflows/codeql-analysis.yml)
[![Coverage](./badges/coverage.svg)](./badges/coverage.svg)

使用此模板来启动 TypeScript action 的创建。🚀

此模板包括编译支持、测试、验证工作流、发布和版本控制指南。

如果你是新手，[Hello world JavaScript action repository](https://github.com/actions/hello-world-javascript-action) 中还有一个更简单的介绍。

## 创建你自己的 Action

要创建你自己的 action，可以使用此仓库作为模板！只需按照以下说明操作：

1. 点击仓库顶部的 **Use this template** 按钮
1. 选择 **Create a new repository**
1. 为你的新仓库选择一个所有者和名称
1. 点击 **Create repository**
1. 克隆你的新仓库

> [!IMPORTANT]
>
> 确保删除或更新 [`CODEOWNERS`](./CODEOWNERS) 文件！有关如何使用此文件的详细信息，请参阅
> [关于代码所有者](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-code-owners)。

## 初始设置

在你将仓库克隆到本地机器或代码空间后，你需要执行一些初始设置步骤才能开发你的 action。

> [!NOTE]
>
> 你需要有一个相对较新的 [Node.js](https://nodejs.org) 版本（20.x 或更高版本应该可以！）。如果你使用像 [`nodenv`](https://github.com/nodenv/nodenv) 或 [`fnm`](https://github.com/Schniz/fnm) 这样的版本管理器，此模板在仓库的根目录中有一个 `.node-version` 文件，可以在你 `cd` 进入仓库时自动切换到正确的版本。此外，GitHub Actions 在任何 `actions/setup-node` actions 中也使用此 `.node-version` 文件。

1. :hammer_and_wrench: 安装依赖

   ```bash
   npm install
   ```

1. :building_construction: 打包 TypeScript 以供分发

   ```bash
   npm run bundle
   ```

1. :white_check_mark: 运行测试

   ```bash
   $ npm test

   PASS  ./index.test.js
     ✓ throws invalid number (3ms)
     ✓ wait 500 ms (504ms)
     ✓ test runs (95ms)

   ...
   ```

## 更新 Action 元数据

[`action.yml`](action.yml) 文件定义了关于你的 action 的元数据，例如输入和输出。有关此文件的详细信息，请参阅
[GitHub Actions 的元数据语法](https://docs.github.com/en/actions/creating-actions/metadata-syntax-for-github-actions)。

当你复制此仓库时，更新 `action.yml` 以包含你的 action 的名称、描述、输入和输出。

## 更新 Action 代码

[`src/`](./src/) 目录是你的 action 的核心！这包含了当你的 action 被调用时将运行的源代码。你可以用自己的代码替换此目录的内容。

编写 action 代码时需要注意以下几点：

- 大多数 GitHub Actions 工具包和 CI/CD 操作是异步处理的。在 `main.ts` 中，你会看到 action 在 `async` 函数中运行。

  ```javascript
  import * as core from '@actions/core'
  //...

  async function run() {
    try {
      //...
    } catch (error) {
      core.setFailed(error.message)
    }
  }
  ```

  有关 GitHub Actions 工具包的更多信息，请参阅
  [文档](https://github.com/actions/toolkit/blob/master/README.md)。

那么，你还在等什么？赶快开始定制你的 action 吧！

1. 创建一个新分支

   ```bash
   git checkout -b releases/v1
   ```

1. 用你的 action 代码替换 `src/` 的内容
1. 为你的源代码添加测试到 `__tests__/`
1. 格式化、测试和构建 action

   ```bash
   npm run all
   ```

   > 这一步很重要！它将运行 [`ncc`](https://github.com/vercel/ncc) 来构建包含所有依赖项的最终 JavaScript action 代码。如果你不运行这一步，你的 action 在工作流中使用时将无法正常工作。这一步还包括 `ncc` 的 `--license` 选项，它将为项目中使用的所有生产节点模块创建一个许可证文件。

1. （可选）在本地测试你的 action

   [`@github/local-action`](https://github.com/github/local-action) 实用程序可用于在本地测试你的 action。它是一个简单的命令行工具，可以"模拟" GitHub Actions 工具包。这样，你可以在本地运行你的 TypeScript action，而无需将更改提交并推送到仓库。

   `local-action` 实用程序可以通过以下方式运行：

   - Visual Studio Code 调试器

     确保查看并在需要时更新
     [`.vscode/launch.json`](./.vscode/launch.json)

   - 终端/命令提示符

     ```bash
     # npx local action <action-yaml-path> <entrypoint> <dotenv-file>
     npx local-action . src/main.ts .env
     ```

   你可以为 `local-action` CLI 提供一个 `.env` 文件，以设置 GitHub Actions 工具包使用的环境变量。例如，设置你的 action 使用的输入和事件负载数据。有关更多信息，请参阅示例文件 [`.env.example`](./.env.example) 和
   [GitHub Actions 文档](https://docs.github.com/en/actions/learn-github-actions/variables#default-environment-variables)。

1. 提交你的更改

   ```bash
   git add .
   git commit -m "我的第一个 action 准备好了！"
   ```

1. 将它们推送到你的仓库

   ```bash
   git push -u origin releases/v1
   ```

1. 创建一个拉取请求并获取关于你的 action 的反馈
1. 将拉取请求合并到 `main` 分支

你的 action 现在已发布！🚀

有关你的 action 版本控制的信息，请参阅
[版本控制](https://github.com/actions/toolkit/blob/master/docs/action-versioning.md)
在 GitHub Actions 工具包中。

## 验证 Action

你现在可以通过在工作流文件中引用它来验证 action。例如，[`ci.yml`](./.github/workflows/ci.yml) 演示了如何引用同一仓库中的 action。

```yaml
steps:
  - name: Checkout
    id: checkout
    uses: actions/checkout@v4

  - name: Test Local Action
    id: test-action
    uses: ./
    with:
      milliseconds: 1000

  - name: Print Output
    id: output
    run: echo "${{ steps.test-action.outputs.time }}"
```

有关示例工作流运行，请查看
[Actions 标签](https://github.com/actions/typescript-action/actions)！🚀

## 使用

测试后，你可以创建版本标签，开发人员可以使用这些标签来引用你的 action 的不同稳定版本。有关更多信息，请参阅
[版本控制](https://github.com/actions/toolkit/blob/master/docs/action-versioning.md)
在 GitHub Actions 工具包中。

要在另一个仓库的工作流中包含 action，你可以使用 `uses` 语法和 `@` 符号来引用特定的分支、标签或提交哈希。

```yaml
steps:
  - name: Checkout
    id: checkout
    uses: actions/checkout@v4

  - name: Test Local Action
    id: test-action
    uses: actions/typescript-action@v1 # 带有 `v1` 标签的提交
    with:
      milliseconds: 1000

  - name: Print Output
    id: output
    run: echo "${{ steps.test-action.outputs.time }}"
```

## 发布新版本

此项目包括一个辅助脚本 [`script/release`](./script/release)，旨在简化为 GitHub Actions 标记和推送新版本的过程。

GitHub Actions 允许用户选择要使用的 action 的特定版本，基于发布标签。此脚本通过执行以下步骤简化了此过程：

1. **检索最新的发布标签：** 脚本首先通过查看你仓库中的本地数据来获取当前分支的最新 SemVer 发布标签。
1. **提示输入新发布标签：** 然后提示用户输入新发布标签。为帮助此操作，脚本显示在上一步中检索到的标签，并验证输入标签的格式（vX.X.X）。还提醒用户更新 package.json 中的版本字段。
1. **标记新发布：** 然后脚本标记一个新发布，并将单独的主要标签（例如 v1, v2）与新发布标签（例如 v1.0.0, v2.1.2）同步。当用户创建新的主要发布时，脚本会自动检测到这一点，并为之前的主要版本创建一个 `releases/v#` 分支。
1. **将更改推送到远程：** 最后，脚本将必要的提交、标签和分支推送到远程仓库。从这里，你需要在 GitHub 中创建一个新发布，以便用户可以轻松地在他们的工作流中引用新标签。 