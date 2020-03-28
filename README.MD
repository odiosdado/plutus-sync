# plutus-api

pluts-api is the backend API for the Plutus app.

## Development

You must have a .env file in the root project. The following environment variables are necessary:

```
MONGODB_URI=mongodb://localhost:27017/drivlab
JWT_SECRET=jwt-secret-here
FACEBOOK_CLIENT_ID=facebook-client-id-here
FACEBOOK_CLIENT_SECRET=facebook-client-secret-here
FACEBOOK_CALLBACK_URL=http://localhost:3000/auth/facebook/callback
FACEBOOK_PROFILE_URL=https://graph.facebook.com/v2.5/me?fields=first_name,last_name,email
GOOGLE_CLIENT_ID=google-client-id-here
GOOGLE_CLIENT_SECRET=google-client-secret-here
GOOGLE_CALLBACK_URL=http://localhost:3000/v1/auth/google/callback
LOGGER_LEVEL=debug
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