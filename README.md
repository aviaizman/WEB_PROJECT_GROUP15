# Tripper 🌿

Tripper is a simple web application for discovering and uploading hiking routes in Israel.
The project includes client-side pages, an Express server, and a MySQL database.

## How to Run the Project 🚀

### 1. Create the Database Tables

Before running the server, open MySQL and run the SQL file that exists in the project folder:

```sql
SOURCE tripper_schema_data.sql;
```

If the file has a different name, use that file name instead.

This file creates the required tables and inserts the initial data:

* `users`
* `routes`

### 2. Install Dependencies

In the project folder, run:

```bash
npm install
```

### 3. Configure the Database Connection

Make sure `db.config.js` matches your local MySQL settings:

```js
HOST: "localhost"
USER: "root"
PASSWORD: "your_mysql_password"
DB: "mysql"
```

Do not upload real passwords to GitHub.

### 4. Run the Server

```bash
npm run dev
```

Or:

```bash
nodemon tripper.js
```

### 5. Open the Website

Go to:

```text
http://localhost:8080/
```

## Main Features 🥾

* View hiking routes from the database
* Search routes by region, difficulty and duration
* Login using users from the database
* Upload new routes
* Save route features such as circular route, dogs, babies, romantic route and water entry

## Project Structure

```text
public/
  index.html
  login.html
  upload.html
  css/
  js/
  images/

tripper.js
db.js
db.config.js
database.sql
package.json
```

Enjoy the trip 🌄
