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
