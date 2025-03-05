# github-repository-sync-action

## 项目简介

`github-repository-sync-action` 是一个使用 TypeScript 编写的 GitHub Action 插件，旨在实现代码仓库的自动同步。该插件支持多种代码仓库类型，包括 GitHub、GitLab 和 Gitee 等。

## 功能特性

- **多仓库类型支持**：支持 GitHub、GitLab、Gitee 等多种代码仓库。
- **自动同步**：从源仓库自动同步代码到目标仓库。
- **并发同步**：支持对多个仓库对进行并发同步，互不影响。
- **灵活配置**：通过 GitHub Actions 的 variables 和 secrets 配置源和目标仓库的 URL 及认证信息。
- **日志记录**：保存运行日志，便于问题排查。

## 使用方法

1. **配置变量和密钥**：

   - 在 GitHub Actions 的 variables 中配置 `source_reopsitory_url_list` 和 `target_repository_url_list`，每行为一个仓库的 URL。
   - 在 secrets 中配置 `source_repository_username`、`source_repository_password`、`target_repository_username` 和 `target_repository_password`。这些可以为空，如果为空则不使用认证。
2. **工作流配置**：

   - 在 `.github/workflows/` 目录下创建或修改工作流文件，引用此 Action。
3. **运行同步**：

   - 每对仓库将以源仓库名为文件夹名克隆到本地，然后推送到目标仓库。

## 使用示例

以下是一个简单的 GitHub Actions 工作流示例，展示如何使用 `github-repository-sync-action`：

```yaml
name: Repository Sync

on:
  push:
    branches:
      - main

jobs:
  sync:
    runs-on: ubuntu-latest
    steps:
      - name: Run Repository Sync Action
        uses: NullPointExceptionForEveryone/github-repository-sync-action@v2.0.0
        with:
          source_repository_url_list: ${{ vars.SOURCE_REPOSITORY_URL_LIST }}
          source_repository_username: ${{ secrets.SOURCE_REPOSITORY_USERNAME }}
          source_repository_password: ${{ secrets.SOURCE_REPOSITORY_PASSWORD }}
          target_repository_url_list: ${{ vars.TARGET_REPOSITORY_URL_LIST }}
          target_repository_username: ${{ secrets.TARGET_REPOSITORY_USERNAME }}
          target_repository_password: ${{ secrets.TARGET_REPOSITORY_PASSWORD }}
```

在这个示例中，工作流会在 `main` 分支有推送时触发，使用 `github-repository-sync-action` 来同步代码仓库。

## 技术架构

- **核心代码**：使用 TypeScript 编写。
- **CI/CD**：使用 GitHub Actions 工具包进行持续集成和部署。
- **打包工具**：使用 ncc 打包 TypeScript 代码以供分发。
- **Node.js 版本**：20

## 目录结构

- `src/`：包含核心 TypeScript 源代码。
- `__tests__/`：包含测试代码。
- `.github/workflows/`：包含 GitHub Actions 工作流配置。
- `script/`：包含辅助脚本，如发布脚本。

## 贡献指南

欢迎对本项目进行贡献！请提交 Pull Request 或报告 Issue。

## 许可证

本项目采用 MIT 许可证。
