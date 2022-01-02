# plutus-sync

plutus-sync is stock scoring system. Data is aggregated from [Financial Modeling Pro](https://financialmodelingprep.com) endpoints. Each stock is given a custom value based on stock price and reported financial data.

Data is uploaded into BigQuery by Google for further analysis and reporting.

## nodejs

You must have a .env file in the root project. The following environment variables are necessary:

```
FMP_BASE_URL=https://financialmodelingprep.com/api/v3/
FMP_API_KEY=MYSECRETTOKEN
GOOGLE_APPLICATION_CREDENTIALS=path/to/json/key
```
You can launch via nodemon/babel

```bash
npm run build
npm run start
```
## Docker

To run the docker image, perform the following commands, environment varibales will need to be passed
```sh
docker build -t plutus-sync .
docker run \
    -e FMP_BASE_URL=https://financialmodelingprep.com/api/v3/ \
    -e FMP_API_KEY=MYSECRETTOKEN \
    -e GOOGLE_APPLICATION_CREDENTIALS=path/to/json/key \
    plutus-sync
```
## Terraform & GCP
This is currently setup to run on GCP. The docker container is built and uploaded to a container registry. A Cloud Run and Cloud Schedule is then created to run on the 16th of every month. A BigQuery table is also created to house the stock data.

The following resources are used:
- Container Registry
- Secret Manager
- Cloud Run
- Cloud Scheduler
- BigQuery

## BigQuery
A sample query is attached below, this will report on the top 25 stocks per month basis:
```sql
select * from
(
    select 
        name, 
        symbol,
        plutusValue,
        price,
        assets,
        netIncome,
        liabilities,
        shares,
        fillingDate,
        fillingPeriod,
        fillingLink,
        date(valueDate) as dt, 
        row_number() over(partition by date(valueDate) order by plutusValue desc) as rank
    from `plutus-273220.plutus_sync.stocks`
    where exchange = 'New York Stock Exchange'
    and plutusValue is not null 
    and plutusValue != 0
)A
where rank <= 25
order by dt
```

## License
[GNU GPLv3](https://choosealicense.com/licenses/gpl-3.0/)