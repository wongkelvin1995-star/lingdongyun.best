# 灵动云官网 · lingdongyun.best

灵动云（lingdongyun）官网静态站点：套餐价格、选择指南、客户端说明、使用教程与常见问题。纯 HTML，无需构建。

## 目录

| 文件 | 说明 |
| --- | --- |
| `index.html` | 首页落地页 |
| `guides/index.html` | 灵动云教程列表 |
| `guides/choose-plan.html` | 月付、年付和一次性流量怎么选 |
| `guides/clash-subscription-setup.html` | Clash 订阅导入准备与步骤 |
| `guides/estimate-traffic.html` | 每月流量估算（含计算器） |
| `guides/troubleshooting.html` | 订阅更新失败与连接问题排查 |
| `favicon.ico` `favicon.svg` `favicon-32.png` `apple-touch-icon.png` | 网站图标（引用时带 `?v=日期` 版本号，换图标后改版本号即可让浏览器刷新缓存） |
| `logo-512.png` | 品牌 LOGO（512×512，结构化数据与外部引用） |
| `og-image.png` | 社交分享预览图 |
| `robots.txt` `sitemap.xml` | 搜索引擎抓取配置 |
| `CNAME` | GitHub Pages 自定义域名 |

## 待补充

- 「注册 / 登录」和「选择套餐」按钮目前指向页面内的 `#start`，拿到用户面板地址后，全局替换带 `data-panel` 属性的链接。
- 页脚「机场测评」目前指向 `guides/index.html`。

## 部署

- **GitHub Pages**：本文件夹位于仓库的 `lingdongyun.best/` 子目录，由仓库根目录的 `.github/workflows/pages.yml` 自动发布。Settings → Pages → Source 选 **GitHub Actions**，Custom domain 填 `lingdongyun.best`。
- **Cloudflare Pages**：连接本仓库，构建命令留空，输出目录为 `lingdongyun.best`。

上线后在 Google Search Console 提交 `https://lingdongyun.best/sitemap.xml`。
