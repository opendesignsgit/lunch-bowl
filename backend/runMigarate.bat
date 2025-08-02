@echo off
echo ========================================
echo  🔁 Running Migrations and Seeding...
echo ========================================

REM Move to backend directory (current location)
cd /d %~dp0

REM Run migrate-mongo
echo ✅ Migrating database...
npx migrate-mongo up

REM Then run seeder
echo ✅ Seeding collections...
node seed.js

echo ========================================
echo ✅ All done.
echo ========================================
pause
