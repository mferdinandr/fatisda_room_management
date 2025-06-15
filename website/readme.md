# How to run this project
## Clone Project
1. Clone github link 
```bash
git clone https://github.com/mferdinandr/fatisda_room_management.git
```
2. Navigate to the project directory
```bash 
cd fatisda_room_management/website
```
## Install Dependencies
1. Install PHP dependencies, 
```bash 
composer install
```
2. Install Node.js dependencies 
```bash
npm install .
```
## Environment Setup
1. Copy environment file, 
```bash
cp .env.example .env
```
2. Generate application key, 
```bash 
php artisan key:generate
```
## Database Confirguration
Edit ```.env``` file
```bash
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=fatisda_room_manager
DB_USERNAME=your_username
DB_PASSWORD=your_password
```

## Database Setup
### Option 1: Using migration and seeder
1. Create your database (via phpMyAdmin or MySql Command)
```bash
CREATE DATABASE fatisda_room_manager
```
2. Run migration
```bash
php artisan migrate
```
3. Run seeder
```bash
php artisan db:seed
```
### Option 2: Using Database SQL 
1. Create your database (via phpMyAdmin or MySql Command)
```bash
CREATE DATABASE fatisda_room_manager
```
2. Download the database dump file from: [Google Drive Link / Contact Developer]
3. Import the SQL file

## Run Server
```bash
composer run dev
``` 
or if only wanna run server
```bash
php artisan serve
```

## Access The Application
Backend API: ````http://127.0.0.1:8000````

Frontend: ```http://localhost:3000``` (or check terminal output for exact URL)
