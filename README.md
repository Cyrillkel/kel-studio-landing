# KEL Studio

Лендинг веб-студии KEL Studio: https://kel.agency

Next.js 16 (App Router, Turbopack), React 19, Tailwind CSS v4, GSAP, i18next (ru/en), pnpm.

## Разработка

```bash
pnpm install
pnpm dev          # http://localhost:3000
pnpm build        # прод-сборка
npx tsc --noEmit  # проверка типов
npx eslint .      # линтер
```

## Деплой

Пуш в `main` запускает `.github/workflows/deploy.yml`: сборка на GitHub Actions,
затем готовый `output: "standalone"` уезжает на сервер по rsync и сервис
перезапускается. На сервере ничего не собирается и не устанавливается.

Секреты репозитория: `DEPLOY_HOST`, `DEPLOY_USER`, `DEPLOY_SSH_KEY`.

На сервере: systemd-сервис `kel-studio` (Node на 127.0.0.1:3000), nginx с HTTPS
от Let's Encrypt, релизы в `/var/www/kel-studio/releases`, симлинк `current` на
активный.

```bash
ssh kel-vps 'journalctl -u kel-studio -n 50 --no-pager'   # логи сайта
```

## Индексация

Сайт закрыт от поисковиков, пока идёт работа: флаг `INDEXABLE` в `lib/site.ts`
переключает разом мета-тег robots, `/robots.txt` и заголовок `X-Robots-Tag`.

Подробности по проекту, анимациям и серверу - в `KEL-STUDIO-CONTEXT.md` рядом с
репозиторием.
