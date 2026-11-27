# Развёртывание сайта Оксаны

GitHub Actions запускает проверки сайта, собирает образы сайта и миграций и проверяет их с PostgreSQL. Один Caddy обслуживает два HTTPS-домена на VPS. У каждого окружения свой Compose-проект, веб-контейнер, экземпляр PostgreSQL, том, учётные данные и SSH-ключ для релизов.

| Ветка | Workflow | Пакеты GHCR | Переключатель SSH-деплоя |
| --- | --- | --- | --- |
| `develop` | Development | `site-oksana/dev-web`, `site-oksana/dev-migrate` | `DEV_DEPLOY_ENABLED` |
| `main` | Verify and release | `site-oksana/web`, `site-oksana/migrate` | `DEPLOY_ENABLED` |

Открывайте рабочие PR в `develop`. После проверки тестовой версии откройте релизный PR `develop → main` и дождитесь статуса `Project checks`. Сливайте релизный PR через `Create a merge commit`, чтобы сохранялась общая история долгоживущих веток. После слияния `main` запускает production-сборку.

## Подготовка VPS

1. Подготовьте Linux x86_64 с Docker Engine, Compose v2.24.4 или новее, curl, flock, restic и relay с интерфейсом sendmail. Разрешите входящий SSH и TCP-порты 80 и 443. PostgreSQL и Next.js используют внутренние Docker-сети. Для домена настройте запись A на VPS и запись AAAA при рабочем IPv6.
2. Получите проверенный коммит репозитория на VPS под администратором и выполните `sudo bash ops/install.sh`. Установщик копирует операционные файлы в /etc/site-oksana и обновляет systemd. Для изменений Compose, Caddy или серверного скрипта повторите установку из проверенного коммита.
3. Заполните /etc/site-oksana/production.env. Задайте SITE_ADDRESS как один DNS-адрес без схемы и порта, разные случайные POSTGRES_PASSWORD и APP_DB_PASSWORD, а также SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD, SMTP_FROM и LEAD_TO. Для первого запуска оставьте PUBLIC_LEADS_ENABLED и PUBLIC_INDEXABLE равными false.
4. Заполните /etc/site-oksana/backup.env. Хранилище restic располагается в отдельном S3-совместимом бакете. Храните пароль restic в /etc/site-oksana/restic-password с правами 0600, а его копию — в хранилище секретов оператора. Для нового бакета один раз выполните:

   ~~~sh
   sudo bash -c 'set -a; . /etc/site-oksana/backup.env; set +a; restic init'
   ~~~

5. Создайте пользователя site-deploy без административных групп. В его authorized_keys добавьте выделенный публичный SSH-ключ с ограничением команды:

   ~~~text
   restrict,command="/usr/local/sbin/site-oksana-ssh" ssh-ed25519 <публичный-ключ>
   ~~~

   Для /etc/sudoers.d/site-oksana-deploy через visudo задайте правило:

   ~~~sudoers
   site-deploy ALL=(root) NOPASSWD: /usr/local/sbin/site-oksana-release deploy *
   ~~~

   Используйте права 0700 для каталога .ssh и 0600 для authorized_keys. Включите вход по ключу, проверьте отказ входа по паролю для site-deploy и запрещайте прямой SSH-вход root. Секретный ключ релиза хранится в GitHub, отдельный ключ администратора остаётся у оператора.

## Настройки GitHub и первый релиз

- В настройках main потребуйте PR и успешный статус Project checks. Для Environment production разрешите ветку main. Установите секрет DEPLOY_SSH_KEY в этом Environment. Там же задайте переменные DEPLOY_HOST, DEPLOY_PORT, DEPLOY_USER=site-deploy и DEPLOY_KNOWN_HOSTS. Переменную SITE_URL формата https://ваш-домен задайте в настройках репозитория для мониторинга. Для DEPLOY_KNOWN_HOSTS сверяйте публичный ключ SSH-хоста через консоль VPS. Для нестандартного порта используйте запись [хост]:порт.
- Пока VPS готовится, оставьте DEPLOY_ENABLED=false. Первый успешный запуск main публикует пакеты site-oksana/web и site-oksana/migrate. В настройках каждого пакета выберите Public для скачивания с VPS. До открытия пакетов проверьте, что артефакты и образ содержат только содержимое репозитория и публичные ресурсы.
- Когда DNS, сервер и хранилище копий готовы, установите DEPLOY_ENABLED=true. Для первого запуска выполните Verify and release вручную на main. После этого новые коммиты main запускают релиз автоматически.
- Caddy выпускает и продлевает сертификат Let’s Encrypt. Постоянные тома caddy_data и caddy_config сохраняют ключи и состояние Caddy при смене образа. Тома production имеют префикс site-oksana. Compose-проект production называется site-oksana.

## Development на том же VPS

1. Добавьте DNS-запись для отдельного поддомена, например `dev.example.com`, на тот же IP. Дождитесь первого production-релиза. На уже настроенном VPS выполните `sudo bash ops/install.sh` из проверенной версии с конфигурацией обоих окружений.
2. Заполните `/etc/site-oksana/development.env`. Укажите `DEV_SITE_ADDRESS` как имя dev-поддомена и задайте два отдельных случайных пароля в `DEV_POSTGRES_PASSWORD` и `DEV_APP_DB_PASSWORD`. Compose-проект `site-oksana-development` использует базу `oksana_development` и том `site-oksana-development_postgres_data`.
3. Скопируйте `/etc/site-oksana/development.caddy.example` в рабочий файл, замените домен и логин при необходимости. Сгенерируйте bcrypt-хэш интерактивно через `sudo docker run --rm -it caddy:2-alpine caddy hash-password` и подставьте его вместо `REPLACE_WITH_BCRYPT_HASH`. Установите готовый файл как `/etc/site-oksana/caddy-sites/development.caddy` с правами 0644. Затем выполните `sudo site-oksana-release refresh`, чтобы применить маршрут и проверить работу production.
4. Создайте на VPS отдельного пользователя `site-deploy-dev` без групп Docker и sudo. Используйте отдельную пару SSH-ключей. В `authorized_keys` укажите следующую команду.

   ~~~text
   restrict,command="/usr/local/sbin/site-oksana-ssh development" ssh-ed25519 <публичный-ключ-dev>
   ~~~

   Через `visudo` добавьте правило в `/etc/sudoers.d/site-oksana-development-deploy`.

   ~~~sudoers
   site-deploy-dev ALL=(root) NOPASSWD: /usr/local/sbin/site-oksana-development-release deploy *
   ~~~

5. В GitHub Environment `development` с доступом только из `develop` задайте переменные `DEV_DEPLOY_HOST`, `DEV_DEPLOY_PORT`, `DEV_DEPLOY_USER=site-deploy-dev`, `DEV_DEPLOY_KNOWN_HOSTS` и секрет `DEV_DEPLOY_SSH_KEY`. Хост и порт могут совпадать с production. Ключ хоста сверяйте через консоль VPS.
6. После первой сборки выберите Public для пакетов `dev-web` и `dev-migrate` после проверки их содержимого. В настройках репозитория выставьте `DEV_DEPLOY_ENABLED=true`. Запустите `Development` на ветке `develop` или отправьте в неё коммит. Проверьте, что dev-страница просит пароль, а после входа открывается и принимает тестовую заявку.

Храните в dev только вымышленные заявки. В dev отключены письма и индексация. Диск и ресурсы хоста общие, веб-сервис и база dev ограничены по памяти и CPU. Копии production делаются по отдельному расписанию. Релиз dev при сбое проверки возвращает предыдущий веб-образ, поэтому изменения схемы должны сохранять совместимость с ним.

## Открытие формы и индексации

1. Установите утверждённую политику в формате Markdown в /etc/site-oksana/privacy/policy.md с правами 0644. Укажите PRIVACY_VERSION, например `2026-11-27`. Владелец утверждает оператора, контакты, цели, основания, сроки хранения и порядок удаления данных. Новая редакция получает новый номер.
2. Проверьте настройки SMTP и получателя. Затем включите PUBLIC_LEADS_ENABLED=true и выполните `sudo site-oksana-release refresh`. Отправьте одну помеченную контрольную заявку через публичный сайт. Сверьте курс, согласие, версию политики и статус доставки в PostgreSQL. Проверьте письмо у получателя и удалите контрольную запись по её UUID при завершении приёмки.
3. Включите PUBLIC_INDEXABLE=true, повторите refresh и проверьте /robots.txt, /sitemap.xml и страницы. Черновики должны давать страницу отсутствующего курса. Для замены политики сначала выключите приём заявок через refresh, затем установите файл и номер редакции и снова откройте форму.

## Копии, мониторинг и откат

После первого успешного деплоя выполните:

~~~sh
sudo site-oksana-release backup
sudo site-oksana-release restore-check
sudo systemctl enable --now site-oksana-backup.timer site-oksana-restore.timer site-oksana-check.timer
~~~

Restic хранит семь дневных и четыре недельных точки. Проверка восстановления создаёт отдельную временную базу, восстанавливает последнюю копию и выводит число заявок. Следите за использованием места в бакете и запускайте `restic prune` по согласованному графику обслуживания. SMTP relay на хосте отправляет операционные письма на OPS_ALERT_TO. Проверьте его командой `sudo site-oksana-notify setup-check`. В GitHub включите уведомления о сбоях Actions. Workflow Production availability and TLS проверяет доступность сайта, перенаправление на HTTPS и запас срока сертификата в 21 день.

Сервер делает копию перед релизом, применяет SQL и переключает веб-контейнер. При сбое проверки он возвращает последний работающий образ. Вручную вернуть предыдущий образ можно через `sudo site-oksana-release rollback`. Миграции до вывода предыдущей версии из эксплуатации должны оставлять её рабочей. Настройки окружения меняются командой refresh. Таймеры и обновления PostgreSQL планируйте отдельно от обычных релизов сайта.

Для просмотра заявок подключитесь под администратором и выполните:

~~~sh
sudo docker compose -p site-oksana --env-file /etc/site-oksana/production.env \
  --env-file /var/lib/site-oksana/current.env -f /etc/site-oksana/compose.yaml \
  -f /etc/site-oksana/compose.production.yaml exec postgres psql -U postgres -d oksana
~~~

Подставьте фактический POSTGRES_DB, если он отличается. Заявки с mail_status=failed или зависшие pending проверьте вручную. После связи с заявителем обновите статус обработки в PostgreSQL. Серверный мониторинг сообщает о таких заявках счётчиком и не включает контакты в письма.
