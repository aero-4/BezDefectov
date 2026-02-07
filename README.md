# BezDefectov

## Цель: сделать приложение через которое люди могут тренировать свои дефекты речи, сохраняется их прогресс и работают таймеры на уроках

[Backend](https://github.com/aero-4/BezDefectov/tree/main/backend) | [Frontend](https://github.com/aero-4/BezDefectov/tree/main/frontend)

### Запуск:
1. git clone https://github.com/aero-4/BezDefectov
2. Установить докер
3. `cd BezDefectov`
4. Выбрать стадию разработки: dev, tests, prod

#### Запустить PRODUCTION-mode:
1. Указать основные переменные в .env.prod
2. Указать домен на котором будет установлен сайт DOMAIN, DOMAIN_EMAIl (сертификаты для SSL https будут автоматически установлены)
3. `docker compose -p bezdefectov_prod up --build -d`
4. Приложение запущено. Перейти по домену сайта. Бекенд часть находится на https://{DOMAIN}/api


#### Запустить DEVELOPMENT-mode:
1. Указать основные переменные в .env.dev
2. `docker compose -f docker-compose.dev.yml -p bezdefectov_dev up --build -d`
3. Приложение запущено на http://localhost:8000

#### Запустить TESTS-mode:
1. Указать основные переменные в .env.test
2. `docker compose -f docker-compose.test.yml -p bezdefectov_test up --build -d`
3. Приложение будет запущено и автоматически протестировано
