module.exports = ({env}) => ({
/*    upload: {
        provider: 'aws-s3',
        providerOptions: {
            accessKeyId: env('AWS_ACCESS_KEY_ID'),
            secretAccessKey: env('AWS_ACCESS_SECRET'),
            region: env('AWS_REGION'),
            params: {
                Bucket: env('AWS_BUCKET'),
            }
        }
    }
*/
  graphql: {
    endpoint: '/graphql',
    shadowCRUD: true,
    playgroundAlways: true,
    depthLimit: 7,
    amountLimit: 1000,
    apolloServer: {
      tracing: false,
    },
  },
  upload: {
    provider: 'cloudinary',
    providerOptions: {
      cloud_name: env('CLOUDINARY_NAME'),
      api_key: env('CLOUDINARY_API_KEY'),
      api_secret: env('CLOUDINARY_API_SECRET'),
    },
    actionOptions: {
      upload: {
        folder: env('CLOUDINARY_FOLDER'),
      },
      delete: {},
    }
  },
  email: {
    provider: 'sendgrid',
    providerOptions: {
      apiKey: env('SENDGRID_API_KEY'),
    },
    settings: {
      defaultFrom: env('DEFAULT_EMAIL'),
      defaultReplyTo: env('DEFAULT_EMAIL'),
    },
  },
});
