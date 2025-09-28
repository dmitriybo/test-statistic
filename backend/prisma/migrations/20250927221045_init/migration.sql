-- CreateTable
CREATE TABLE "public"."currencies" (
    "code" VARCHAR(8) NOT NULL,
    "name" TEXT NOT NULL,
    "symbol" VARCHAR(8) NOT NULL,

    CONSTRAINT "currencies_pkey" PRIMARY KEY ("code")
);

-- CreateTable
CREATE TABLE "public"."users" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."logins" (
    "id" BIGSERIAL NOT NULL,
    "event_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "logins_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."tries" (
    "id" BIGSERIAL NOT NULL,
    "event_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "is_first" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "tries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."deposits" (
    "id" BIGSERIAL NOT NULL,
    "event_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "amount" DECIMAL(30,8) NOT NULL,
    "currency_code" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "is_first" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "deposits_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."kpi_hourly_agg" (
    "bucket_start" TIMESTAMP(3) NOT NULL,
    "currency_code" TEXT NOT NULL,
    "registrations" INTEGER NOT NULL DEFAULT 0,
    "try_count" INTEGER NOT NULL DEFAULT 0,
    "first_deposit_count" INTEGER NOT NULL DEFAULT 0,
    "first_deposit_sum" DECIMAL(30,8) NOT NULL DEFAULT 0,
    "repeat_deposit_count" INTEGER NOT NULL DEFAULT 0,
    "repeat_deposit_sum" DECIMAL(30,8) NOT NULL DEFAULT 0,
    "total_deposit_count" INTEGER NOT NULL DEFAULT 0,
    "total_deposit_sum" DECIMAL(30,8) NOT NULL DEFAULT 0,

    CONSTRAINT "kpi_hourly_agg_pkey" PRIMARY KEY ("bucket_start","currency_code")
);

-- CreateIndex
CREATE INDEX "users_created_at_idx" ON "public"."users"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "logins_event_id_key" ON "public"."logins"("event_id");

-- CreateIndex
CREATE INDEX "logins_user_id_created_at_idx" ON "public"."logins"("user_id", "created_at");

-- CreateIndex
CREATE INDEX "logins_created_at_idx" ON "public"."logins"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "tries_event_id_key" ON "public"."tries"("event_id");

-- CreateIndex
CREATE INDEX "tries_created_at_idx" ON "public"."tries"("created_at");

-- CreateIndex
CREATE INDEX "tries_user_id_created_at_idx" ON "public"."tries"("user_id", "created_at");

-- CreateIndex
CREATE UNIQUE INDEX "deposits_event_id_key" ON "public"."deposits"("event_id");

-- CreateIndex
CREATE INDEX "deposits_created_at_idx" ON "public"."deposits"("created_at");

-- CreateIndex
CREATE INDEX "deposits_currency_code_created_at_idx" ON "public"."deposits"("currency_code", "created_at");

-- CreateIndex
CREATE INDEX "deposits_user_id_created_at_idx" ON "public"."deposits"("user_id", "created_at");

-- CreateIndex
CREATE INDEX "deposits_is_first_idx" ON "public"."deposits"("is_first");

-- CreateIndex
CREATE UNIQUE INDEX "uniq_user_first_deposit" ON "public"."deposits"("user_id", "is_first");

-- CreateIndex
CREATE INDEX "kpi_hourly_agg_currency_bucket_start_idx" ON "public"."kpi_hourly_agg"("currency_code", "bucket_start");

-- CreateIndex
CREATE INDEX "idx_kpi_hourly_agg_currency_date" ON "public"."kpi_hourly_agg"("currency_code", "bucket_start");

-- AddForeignKey
ALTER TABLE "public"."logins" ADD CONSTRAINT "logins_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."tries" ADD CONSTRAINT "tries_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."deposits" ADD CONSTRAINT "deposits_currency_code_fkey" FOREIGN KEY ("currency_code") REFERENCES "public"."currencies"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."deposits" ADD CONSTRAINT "deposits_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."kpi_hourly_agg" ADD CONSTRAINT "kpi_hourly_agg_currency_code_fkey" FOREIGN KEY ("currency_code") REFERENCES "public"."currencies"("code") ON DELETE RESTRICT ON UPDATE CASCADE;
