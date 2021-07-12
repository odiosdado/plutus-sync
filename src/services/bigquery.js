const { BigQuery } = require('@google-cloud/bigquery');
import config from '../constants/config';
import logger from '../logger'

const bigquery = new BigQuery({
    projectId: 'plutus-273220',
    keyFilename: config.bigQuery.keyPath
});

export default function insertRowsAsStream(rows) {
    bigquery
        .dataset(config.bigQuery.datasetId)
        .table(config.bigQuery.tableId)
        .insert(rows).then(() => {
            logger.debug(`insertRowsAsStream:: Inserted ${rows.length} rows`);
        })
        .catch(error => {
            logger.error(`insertRowsAsStream:: error inserting rows:`, error.response.insertErrors[0].errors)
        });
}