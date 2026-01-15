
# 见己 · 深度临床心理评估档案系统

专业级临床心理评估平台，支持 C-SSRS、UCLA、PCL-5 及复原力画像，具备 AI 辅助分析功能。

## 部署到 GitHub Pages 指南

您可以轻松地将此系统部署为在线网站：

1. **创建仓库**：在 GitHub 上创建一个新的公开仓库（Repository）。
2. **上传文件**：将本项目的所有文件（包括 `index.html`, `App.tsx`, `components/` 文件夹等）上传到仓库根目录。
3. **开启 GitHub Pages**：
   - 进入仓库的 **Settings**（设置）。
   - 在左侧菜单点击 **Pages**。
   - 在 **Build and deployment** 部分，将 **Source** 设置为 "Deploy from a branch"。
   - 选择 `main` 分支和 `/ (root)` 目录，点击 **Save**。
4. **访问链接**：等待约 1 分钟，GitHub 会生成一个类似 `https://<您的用户名>.github.io/<仓库名>/` 的链接。

## 核心特性

- **数据隐私**：评估数据仅保存在您的本地浏览器中，除非使用 AI 功能，否则不会产生网络交互。
- **跨端支持**：适配手机、平板及电脑，支持 PWA（可安装为桌面应用）。
- **专业导出**：优化的 PDF 打印样式，方便存入纸质档案。
