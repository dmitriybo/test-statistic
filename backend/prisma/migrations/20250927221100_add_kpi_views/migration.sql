CREATE MATERIALIZED VIEW mv_kpi_daily AS
SELECT
    date_trunc('day', bucket_start) AS bucket_start,
    currency_code,
    SUM(registrations)       AS registrations,
    SUM(try_count)         AS try_count,
    SUM(first_deposit_count)            AS first_deposit_count,
    SUM(first_deposit_sum)              AS first_deposit_sum,
    SUM(repeat_deposit_count)            AS repeat_deposit_count,
    SUM(repeat_deposit_sum)              AS repeat_deposit_sum,
    SUM(total_deposit_count) AS total_deposit_count,
    SUM(total_deposit_sum)   AS total_deposit_sum
FROM kpi_hourly_agg
GROUP BY date_trunc('day', bucket_start), currency_code
    WITH NO DATA;

CREATE UNIQUE INDEX idx_mv_kpi_daily_bucket_currency
    ON mv_kpi_daily(bucket_start, currency_code);

CREATE MATERIALIZED VIEW mv_kpi_weekly AS
SELECT
    date_trunc('week', bucket_start) AS bucket_start,
    currency_code,
    SUM(registrations)       AS registrations,
    SUM(try_count)         AS try_count,
    SUM(first_deposit_count)            AS first_deposit_count,
    SUM(first_deposit_sum)              AS first_deposit_sum,
    SUM(repeat_deposit_count)            AS repeat_deposit_count,
    SUM(repeat_deposit_sum)              AS repeat_deposit_sum,
    SUM(total_deposit_count) AS total_deposit_count,
    SUM(total_deposit_sum)   AS total_deposit_sum
FROM mv_kpi_daily
GROUP BY date_trunc('week', bucket_start), currency_code
    WITH NO DATA;

CREATE UNIQUE INDEX idx_mv_kpi_weekly_bucket_currency
    ON mv_kpi_weekly(bucket_start, currency_code);

CREATE MATERIALIZED VIEW mv_kpi_monthly AS
SELECT
    date_trunc('month', bucket_start) AS bucket_start,
    currency_code,
    SUM(registrations)       AS registrations,
    SUM(try_count)         AS try_count,
    SUM(first_deposit_count)            AS first_deposit_count,
    SUM(first_deposit_sum)              AS first_deposit_sum,
    SUM(repeat_deposit_count)            AS repeat_deposit_count,
    SUM(repeat_deposit_sum)              AS repeat_deposit_sum,
    SUM(total_deposit_count) AS total_deposit_count,
    SUM(total_deposit_sum)   AS total_deposit_sum
FROM mv_kpi_weekly
GROUP BY date_trunc('month', bucket_start), currency_code
    WITH NO DATA;

CREATE UNIQUE INDEX idx_mv_kpi_monthly_bucket_currency
    ON mv_kpi_monthly(bucket_start, currency_code);
