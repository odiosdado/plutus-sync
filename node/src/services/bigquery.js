const { BigQuery } = require('@google-cloud/bigquery');
import config from '../constants/config';
import logger from '../logger'

const bigquery = new BigQuery({
    projectId: 'plutus-273220',
    keyFilename: config.bigQuery.keyPath
});

export default function insertRowsAsStream(rows) {
    if(rows.length == 0) {
        logger.debug(`Skipped: No rows to save to bigquery`);
        return
    }
    bigquery
        .dataset(config.bigQuery.datasetId)
        .table(config.bigQuery.tableId)
        .insert(rows).then(() => {
            logger.debug(`insertRowsAsStream:: Inserted ${rows.length} rows`);
        })
        .catch(error => {
            logger.error(`insertRowsAsStream:: error inserting rows:`)
            logger.error(`${error}`)
            if (error.response && error.response.insertErrors
                && error.response.insertErrors[0].errors) {
                logger.error(error.response.insertErrors[0].errors)
            }
        });
}