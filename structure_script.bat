@echo off
set "BASE=backend"

mkdir "%BASE%"

echo. > "%BASE%\pyproject.toml"

mkdir "%BASE%\app"
echo. > "%BASE%\app\__init__.py"
echo. > "%BASE%\app\main.py"
echo. > "%BASE%\app\initial_data.py"

mkdir "%BASE%\app\api"
echo. > "%BASE%\app\api\__init__.py"
echo. > "%BASE%\app\api\main.py"

mkdir "%BASE%\app\api\routes"
echo. > "%BASE%\app\api\routes\__init__.py"

mkdir "%BASE%\app\core"
echo. > "%BASE%\app\core\__init__.py"
echo. > "%BASE%\app\core\config.py"
echo. > "%BASE%\app\core\db.py"
echo. > "%BASE%\app\core\security.py"

mkdir "%BASE%\app\crud"
echo. > "%BASE%\app\crud\__init__.py"

mkdir "%BASE%\app\database"
echo. > "%BASE%\app\database\__init__.py"
echo. > "%BASE%\app\database\session.py"

mkdir "%BASE%\app\models"
echo. > "%BASE%\app\models\__init__.py"

mkdir "%BASE%\app\schemas"
echo. > "%BASE%\app\schemas\__init__.py"

mkdir "%BASE%\app\tests"
echo. > "%BASE%\app\tests\__init__.py"

mkdir "%BASE%\app\tests/api"
echo. > "%BASE%\app\tests/api\__init__.py"

mkdir "%BASE%\app\tests/api/routes"
echo. > "%BASE%\app\tests/api/routes\__init__.py"

mkdir "%BASE%\app\tests/crud"
echo. > "%BASE%\app\tests/crud\__init__.py"

echo. > ".env"

pause
