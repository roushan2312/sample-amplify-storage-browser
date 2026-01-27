import { defineBackend } from "@aws-amplify/backend";
import { auth } from "./auth/resource";
import { Policy, PolicyStatement, Effect } from "aws-cdk-lib/aws-iam";

/**
 * @see https://docs.amplify.aws/react/build-a-backend/ to add storage, functions, and more
 */
const backend = defineBackend({
  auth,
});

/**
 * Note: This code assumes the existence of an S3 bucket named 'my-existing-bucket'.
 * Replace 'my-existing-bucket' with your actual bucket name and adjust the paths and permissions as needed.
 * For more information on authorization access, visit: https://docs.amplify.aws/react/build-a-backend/storage/authorization/#available-actions
 *
 * Requirements for this sample:
 * 1. An S3 bucket named 'my-existing-bucket' must exist in your AWS account.
 * 2. The bucket should contain two folders:
 *    - 'public/' - Accessible by all authenticated and unauthenticated users.
 *    - 'admin/' - Accessible only by users in the admin group and authenticated users.
 *
 * Note: Ensure the bucket exists before deploying this code, as it only sets up IAM policies and does not create the S3 bucket.
 */
const customBucketName = "replica-test-1vp-s3";

backend.addOutput({
  version: "1.3",
  storage: {
    aws_region: "ap-south-1",
    bucket_name: customBucketName,
    buckets: [
      {
        name: customBucketName,
        bucket_name: customBucketName,
        aws_region: "ap-south-1",
        //@ts-expect-error amplify backend type issue https://github.com/aws-amplify/amplify-backend/issues/2569
        paths: {
          "invoices/*": {
            admin: ["get", "list", "write", "delete"],
            // Ops: ["get", "list", "write"]
            // authenticated: ["get", "list", "write"],
          },
          // "admin/*": {
          //   groupsadmin: ["get", "list", "write"],
          //   authenticated: ["get", "list", "write"],
          // },
        },
      },
    ],
  },
});

/**
 * Define an inline policy to attach to Amplify's auth role
 * This policy defines how authenticated users can access your existing bucket
 */
// const OpsPolicy = new Policy(backend.stack, "customBucket1vpOpsPolicy", {
//   statements: [
//     new PolicyStatement({
//       effect: Effect.ALLOW,
//       actions: ["s3:GetObject", "s3:PutObject"],
//       resources: [
//         `arn:aws:s3:::${customBucketName}/invoices/*`,
//       ],
//     }),
//     new PolicyStatement({
//       effect: Effect.ALLOW,
//       actions: ["s3:ListBucket"],
//       resources: [
//         `arn:aws:s3:::${customBucketName}`,
//         `arn:aws:s3:::${customBucketName}/*`,
//       ],
//       conditions: {
//         StringLike: {
//           "s3:prefix": ["invoices/*", "invoices/"],
//         },
//       },
//     }),
//   ],
// });

/**
 * Define an inline policy to attach to Admin user role
 * This policy defines how authenticated users can access your existing bucket
 */
const adminPolicy = new Policy(backend.stack, "customBucketAdminPolicy", {
  statements: [
    new PolicyStatement({
      effect: Effect.ALLOW,
      actions: ["s3:GetObject", "s3:PutObject"],
      resources: [`arn:aws:s3:::${customBucketName}/invoices/*`],
    }),
    new PolicyStatement({
      effect: Effect.ALLOW,
      actions: ["s3:ListBucket"],
      resources: [
        `arn:aws:s3:::${customBucketName}`,
        // `arn:aws:s3:::*`,
        // `arn:aws:s3:::${customBucketName}/*`,
      ],
      conditions: {
        StringLike: {
          "s3:prefix": ["invoices/*", "invoices/"],
        },
      },
    }),
  ],
});

// Add the policies to the unauthenticated user role
// backend.auth.resources.unauthenticatedUserIamRole.attachInlinePolicy(
//   unauthPolicy
// );

// Add the policies to the authenticated user role
// backend.auth.resources.authenticatedUserIamRole.attachInlinePolicy(authPolicy);

// Add the policies to the admin user role
backend.auth.resources.groups["admin"].role.attachInlinePolicy(adminPolicy);
// backend.auth.resources.groups["Ops"].role.attachInlinePolicy(OpsPolicy);