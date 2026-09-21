# 宠物手账

多用户手机 H5：Google 登录，首页是今天的日记。独立于旧站 `labs/pet-studio`，端口 3000。

```bash
createdb -h localhost -U postgres pet_journal
# 或：psql -h localhost -U postgres -c 'CREATE DATABASE pet_journal;'

nvm use 22
cd labs/pet-journal
pnpm i
cp .env.example .env.local
# Google OAuth：回调与主站一致 http://127.0.0.1:3000/api/auth/google/callback
# AUTH_SECRET 可 openssl rand -base64 32
# 出图 Key 从旧站或 backend 抄；不填则占位图
pnpm check
pnpm dev
```

打开 http://127.0.0.1:3000

没配文案 Key 时用本地模板起草，打开今天不空。没配出图 Key 时图为「未接模型」。
