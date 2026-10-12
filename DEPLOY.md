# Deploying Khadamati on a VM (Docker)

Target: a Linux VM (e.g. `172.16.20.69`) reachable by your users. Only port 80 (and 443 if you add a domain) is exposed; MySQL and the API stay on the internal Docker network.

## 1. Prepare the VM (once)
```bash
# Ubuntu/Debian
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER && newgrp docker
sudo ufw allow 22/tcp && sudo ufw allow 80/tcp && sudo ufw allow 443/tcp && sudo ufw enable
```

## 2. Get the code and configure
```bash
git clone https://github.com/BourasIsmail/khadamty.git && cd khadamty
git checkout main            # or the branch you want to deploy
cp .env.example .env
nano .env
```
Set at least:
- `DB_PASSWORD` — a strong password (`openssl rand -base64 24`)
- `JWT_SECRET` — 32+ random characters (`openssl rand -base64 48`)
- `MAIL_USERNAME` / `MAIL_PASSWORD` — SMTP account for welcome emails (new Gmail app password)
- First install only: `SEED_DEMO_DATA=true` and `SEED_ADMIN_PASSWORD=<strong password>` to create the admin account and org structure. Set `SEED_DEMO_DATA=false` afterwards. Note: it also creates demo users (`password123`) — deactivate or delete them from the admin page.

## 3. Start
```bash
docker compose -f docker-compose.prod.yml --env-file .env up -d --build
docker compose -f docker-compose.prod.yml ps
docker compose -f docker-compose.prod.yml logs -f backend
```
Open `http://172.16.20.69` (web) — the API is at `http://172.16.20.69/api`.

## 4. Update
```bash
git pull && docker compose -f docker-compose.prod.yml --env-file .env up -d --build
```

## 5. Backups
```bash
docker compose -f docker-compose.prod.yml exec -T mysql sh -c 'mysqldump -uroot -p"$MYSQL_ROOT_PASSWORD" khadamati_db' > backup-$(date +%F).sql
```
Schedule this with cron and copy the dumps off the VM.

## Mobile app (Flutter)
Build with the API URL: `flutter build apk --dart-define=API_BASE_URL=http://172.16.20.69/api`.
Android blocks plain HTTP by default for release builds — use HTTPS (below) for real distribution.

## HTTPS
`172.16.20.69` is a private address, so no public certificate can be issued for it. For HTTPS, point a domain at the server, replace `:80` with the hostname in `deploy/Caddyfile`, and redeploy; Caddy fetches the certificate automatically (ports 80/443 must be reachable from the internet).

## Notes
- The login lockout is held in memory and resets when the backend restarts.
- Hibernate `ddl-auto: update` manages the schema on startup.
