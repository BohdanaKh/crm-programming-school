
## Instructions

Starter template for [NestJS](https://nestjs.com/) and [Prisma](https://www.prisma.io/).

## Features

- [Prisma](https://www.prisma.io/) for database modelling, migration and type-safe access (Postgres, MySQL & MongoDB)
- A redis client for NestJS w/ [Redis](https://redis.io/)
- 🔐 JWT authentication w/ [passport-jwt](https://github.com/mikenicholson/passport-jwt)
- REST API docs w/ [Swagger](https://swagger.io/)

## Overview

- [Instructions](#instructions)
    - [Features](#features)
    - [Overview](#overview)
    - [Starting](#starting)
        - [1. Pre-requisites](#1-pre-requisites)
        - [2. Getting started](#2-getting-started)
    - [Redis Setup](#redis-setup)
        - [1. Install Redis server](#1-install-redis-server)
        - [2. Restart the Redis server](#2-restart-the-redis-server)
    - [Prisma Setup](#prisma-setup)
        - [1. Install Dependencies](#1-install-dependencies)
        - [2. Prisma: Prisma Migrate](#3-prisma-prisma-migrate)
        - [3. Prisma: Prisma Client JS](#4-prisma-client-js)
        - [4. Start NestJS Server](#6-start-nestjs-server)
    - [Rest Api](#rest-api)
    - [Schema Development](#schema-development)

## Starting

### 1. Pre-requisites
- Install [Node.js](https://nodejs.org/en/) version 18.15.0

### 2. Getting started
- Clone the repository
```
git clone  https://github.com/BohdanaKh/crm-programming-school.git
```


## Redis Setup

### 1. Install Redis server
The following example works with Ubuntu
```bash
 sudo apt-add-repository ppa:redislabs/redis
 sudo apt-get update
 sudo apt-get upgrade
 sudo apt-get install redis-server
 ```

### 2. Restart the Redis server

```bash
 sudo service redis-server restart
 ```

## Prisma Setup

### 1. Install Dependencies

Install the dependencies for the Nest application:

```bash
cd crm-programming-school
# npm
npm install
# yarn
yarn install
```


### 2. Prisma Migrate

[Prisma Migrate](https://github.com/prisma/prisma2/tree/master/docs/prisma-migrate) is used to manage the schema and migration of the database. Prisma datasource requires an environment variable `DATABASE_URL` for the connection to the MySQL database. Prisma reads the `DATABASE_URL` from the root [.env](./.env) file.

Use Prisma Migrate in your [development environment](https://www.prisma.io/blog/prisma-migrate-preview-b5eno5g08d0b#evolving-the-schema-in-development) to

1. Creates `migration.sql` file
2. Updates Database Schema
3. Generates Prisma Client

```bash
npx prisma migrate dev
# or
npm run migrate:dev
```

### 3. Prisma: Prisma Client JS

[Prisma Client JS](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/api) is a type-safe database client auto-generated based on the data model.

Generate Prisma Client JS by running

> **Note**: Every time you update [schema.prisma](prisma/schema.prisma) re-generate Prisma Client JS

```bash
npx prisma generate
# or
npm run prisma:generate
```

### 4. Start NestJS Server

Run Nest Server in Development mode:

```bash
npm run start

# watch mode
npm run start:dev
```
Navigate to `http://localhost:5100`

## Rest Api

[RESTful API](http://localhost:5100/api) documentation available with Swagger.

## Schema Development

Update the Prisma schema `prisma/schema.prisma` and after that run the following two commands:

```bash
npx prisma generate
# or in watch mode
npx prisma generate --watch
# or
npm run prisma:generate
npm run prisma:generate:watch
```

**[⬆ back to top](#overview)**