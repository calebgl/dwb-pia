SET TIME ZONE 'utc';

-- CreateTable
CREATE TABLE "dish" (
    "dish_id" SERIAL NOT NULL,
    "dish_name" VARCHAR(32) NOT NULL,
    "dish_price" MONEY NOT NULL,
    "quantity" DOUBLE PRECISION,
    "dish_image" VARCHAR(128),

    PRIMARY KEY ("dish_id")
);

-- CreateTable
CREATE TABLE "employee" (
    "employee_id" UUID NOT NULL,
    "username" VARCHAR(16) NOT NULL,
    "email" VARCHAR(256) NOT NULL,
    "password" VARCHAR(128) NOT NULL,
    "created_on" TIMESTAMPTZ(6) NOT NULL,
    "last_login" TIMESTAMPTZ(6),

    PRIMARY KEY ("employee_id")
);

-- CreateTable
CREATE TABLE "order_details" (
    "dish_id" INTEGER NOT NULL,
    "order_id" UUID NOT NULL,

    PRIMARY KEY ("dish_id","order_id")
);

-- CreateTable
CREATE TABLE "order_request" (
    "order_id" UUID NOT NULL,
    "total" MONEY NOT NULL,
    "ship_address" VARCHAR(128),
    "ship_postal_code" VARCHAR(16),
    "order_date" TIMESTAMPTZ(6),

    PRIMARY KEY ("order_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "employee.email_unique" ON "employee"("email");

-- AddForeignKey
ALTER TABLE "order_details" ADD FOREIGN KEY ("dish_id") REFERENCES "dish"("dish_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_details" ADD FOREIGN KEY ("order_id") REFERENCES "order_request"("order_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AlterTable
ALTER TABLE "employee" ALTER COLUMN "password" SET DATA TYPE VARCHAR(256);

-- AlterTable
ALTER TABLE "employee" ADD COLUMN     "role" VARCHAR(8) NOT NULL;

-- AlterTable
ALTER TABLE "employee" DROP COLUMN "last_login",
ADD COLUMN     "last_seen" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "employee" ALTER COLUMN "last_seen" DROP DEFAULT;

-- AlterTable
ALTER TABLE "order_request" ALTER COLUMN "ship_address" SET NOT NULL,
ALTER COLUMN "ship_postal_code" SET NOT NULL,
ALTER COLUMN "order_date" SET NOT NULL;

-- AlterColumn
ALTER TABLE "order_details" ADD COLUMN     "amount" INTEGER NOT NULL;

INSERT INTO employee (employee_id, username, email, password, created_on, role, last_seen) VALUES ('032d7efb-6567-4ecc-90a2-567a597d1fe9'  ,  'EpicMario'  ,  'lara_mario2000@hotmail.com'  ,  '$argon2i$v=19$m=4096,t=3,p=1$CpveSJwvW7zvvLbNWOBx8w$HhuF03mb52Aw6TVnXQ2kwXPsFD+8xj9S144LebnK6u2Yxq0MeQdeIe5NwHtGbvwSGMYunbHTIgJ6gDqsVrGoxje49/j4E6Ef'  ,  '2021-05-13 00:28:26.49+00'  ,  'admin' , '2021-05-24 05:35:29.445+00');

INSERT INTO employee (employee_id, username, email, password, created_on, role, last_seen) VALUES ('b5a07f3e-95b0-4ff4-8464-07ddb6fffdec'  ,  'caleb'  ,  'caleb@email.com'  ,  '$argon2i$v=19$m=4096,t=3,p=1$SPsqXdyBVjuUJNEjIoYcyw$z1kbLIPb3K/83AnMNQpJKosm//r/e9xw6DwIK+btzYqtaOhFrmzm9Q2PGHnj1RU1+eUMNO2TyDf1QqyvwvbO+Zgao+NwXPqh'  ,  '2021-05-13 00:24:49.402+00'   , 'admin'  ,  '2021-05-24 05:36:50.544+00');

INSERT INTO employee (employee_id, username, email, password, created_on, role, last_seen) VALUES ('deba8d02-3c12-4dca-9636-b3f7c2b8f7e8'  , 'employeeX'   , 'email@email.com'   , '$argon2i$v=19$m=4096,t=3,p=1$IMOqcc0nlhKRowVWyN/Ncw$Q3mBhl3vmzyzOWwlhNUR0L95ovEHejSgfEXYlxd5ZhZiGFxvbdBqE3K5fyQQiPrjHi0T/njEyOYXBZxM6cGc78wz/jIiL19t'   , '2021-05-24 18:45:38.227+00'  ,  'common'  ,  '2021-05-24 18:45:38.227+00');

INSERT INTO employee (employee_id, username, email, password, created_on, role, last_seen) VALUES ('9ec08c2b-f122-433f-89c1-1025c901f085'  ,  'EduPats'   , 'respaldoedupats@gmail.com' , '$argon2i$v=19$m=4096,t=3,p=1$RDT+u0bjOyMVIza6zSQQPg$MazBYff/3fcAJpOcJdK1NpeMTq39wmQtyszw3STIbFEMAmfA0tFvMReQrOgBI/qB0wxKZIYpcSBHWEx4zEeYEIoDMfVQIEvU'  ,  '2021-05-24 21:11:43.511+00'  ,  'superior'  ,  '2021-05-24 21:28:47.02+00');

INSERT INTO employee (employee_id, username, email, password, created_on, role, last_seen) VALUES ('b2ad44cf-fc4e-4ddf-921f-6b2a99c49be5'  ,  'admin'   , 'admin@email.com'  ,  '$argon2i$v=19$m=16,t=2,p=1$OERjSzNPTFVuSkxyNVg0Mg$1GZFREtDj574gFCNU2Bl+fIt9AH0O6g9vUrEJ1QWF31rlSjjmf9kC7//fa5JMK9Nw0H2QXYw5F27+YTBLaO+EBl0PVr26N3P'   , '2021-05-14 05:27:42.559672+00'  , 'admin'  ,  '2021-05-24 22:05:53.324+00');


INSERT INTO dish (dish_id, dish_name, dish_price, quantity, dish_image) VALUES  (1  ,  'Hamburguesa'  ,  '$49.99'  ,  10  ,  'https://media.timeout.com/images/105296476/image.jpg');


INSERT INTO order_request (order_id, total, ship_address, ship_postal_code, order_date) VALUES ('049a5f19-d5f7-4da2-8ef8-c872ae83dddf'  ,  '$99.98'  ,  'Vista Boulevard 320'   , '67123'  , '2021-05-24 21:49:09.377+00');


INSERT INTO order_details (dish_id, order_id, amount) VALUES (1  ,  '049a5f19-d5f7-4da2-8ef8-c872ae83dddf'  ,  2);

SET TIME ZONE