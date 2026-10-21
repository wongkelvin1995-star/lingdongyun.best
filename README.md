# lingdongyun.best

灵动云网站仓库。每个网站放在自己的文件夹里，互不影响。

## 目录约定

```
lingdongyun.best/
├── README.md
├── <网站名>/          # 一个网站一个文件夹
│   ├── index.html     # 入口页面
│   ├── assets/        # 图片、样式、脚本等
│   └── README.md      # 该网站的简要说明（可选）
└── ...
```

## 网站列表

| 文件夹 | 说明 |
| --- | --- |
| [`lingdongyun.best/`](lingdongyun.best/) | 灵动云官网落地页 + 教程，部署到 https://lingdongyun.best |

## 部署

- **GitHub Pages**：`.github/workflows/pages.yml` 会在 `lingdongyun.best/` 有改动时自动把该文件夹发布到 Pages。首次需在 Settings → Pages → Source 选 **GitHub Actions**，Custom domain 填 `lingdongyun.best`。
- **Cloudflare Pages**（可选）：构建命令留空，输出目录填 `lingdongyun.best`。
