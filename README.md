## Institute Instructor Attendance System

**Required environment (tech stack):**

1. Node.js
2. MongoDB

**Installation:**

1. Node.js - https://nodejs.org/en/download
   Including NPM or Yarn
2. MongoDB - https://www.mongodb.com/docs/manual/installation/
   or else you can use MongoDB Atlas

**Project setup:**

1. **Set environment**:

   1. Create folder called 'env' in root directory
   2. Inside env folder create file .env.dev (for dev environment) if want then also can create .env.production for production environment
   3. Sample env
      .env.dev

      ```
      # API Port
      PORT = 3030

      # Mongo URI
      MONGO_URI = 'mongodb://127.0.0.1:27017/instructor_attendance'

      # JWT secret token
      JWT_SECRET_KEY = '8C2KyE7ukurI3mSa9xocgLa1H'

      # API routes prefix
      API_ROUTES_V1 = '/api/v1'

      # Crypto.js
      CRYPTO_SECRET_KEY = 'noQDLu66PZVcbjZgw0iCpJa8D'
      CRYPTO_SECRET_IV = 'mgzlTfbBZ0JsvvXprbB3BhE2h'
      CRYPTO_ECNRYPTION_METHOD = 'aes-256-cbc'
      ```

   4. Set database name 'instructor_attendance'

2. **Start project** :

   - If you using yarn package manager:

     1. If you are using windows operating system then install win-node-env (optional)

        ```
        yarn add -g win-node-env
        ```

     2. Install the dependencies

        ```
        yarn install
        ```

     3. Run the project

        ```
        yarn run start:dev
        ```

   - If you using node package manage (NPM):

     1. If you are using windows operating system then install win-node-env (optional)

        ```
        npm install -g win-node-env
        ```

     2. Install the dependencies

        ```
        npm install
        ```

     3. Run the project

        ```
        npm run start:dev
        ```

   - If you want to use production environment then user 'production' instead of dev
   - To check code quality run

     ```
     yarn run lint
     or
     npm run lint
     ```

**Process:**

- Add admin user
- Login admin user
- Add holidays in configuration
- Add instructor
- Login instructor
- Instructor check in
- Instructor check out
- Instructor applies leaves

**Headers**:

- Authorization and Authentication both are implemented. Like Only admin can add intructor, only intructor can do check-in and check-out etc.
- Use **role** and **userid** in heders in every api

**Assumption:**

- Added Institution holiday list (custom/configurable) - Let's say a tutor requests a two-week absence. During that time, there may be public holidays that shouldn't be taken into account for leave requests.

**Postman collection link** - [https://api.postman.com/collections/12493214-21a12667-d528-4d15-a676-b0210348d535?access_key=PMAT-01HPQ22A89NTSVMNK76FRYPMPK]()

**Deployement:**

- Follow the _Installation process_ above
- Install pm2 on server

  ```
  npm install -g pm2
  or
  yarn add -g pm2
  ```

- Clone the project form version controll (github)
- Follow the _Environment setup process_
- Use ecosystem for run

  ```
  pm2 start ecosystem/production.ecosystem.config.js
  ```

- Check status

  ```
  pm2 list
  pm2 log <id>
  ```
