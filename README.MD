# plutus-sync

pluts-sync aggregates stock information from Financial Modeling Pro. This data is then uploaded to google big query

## Development

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

Docker image is also available, environment varibales will need to be passed
```bash
docker build -t drivlab-api .
docker run drivlab-api -e MONGODB_URI=mongodb://localhost:27017/drivlab -e JWT_SECRET=jwt-secret-here ...
```
## Kubernetes & Bitbucket

Kubernetes deployment file is located in the ```./deploy/``` directory. Its configured to be deployed via the
provided ```bitbucket-pipelines.yml``` pipeline. Environment variables are set to be replaced with
variables set in Bitbucket via the ```./deploy/replaceTokens.sh```

## License
[MIT](https://choosealicense.com/licenses/mit/)