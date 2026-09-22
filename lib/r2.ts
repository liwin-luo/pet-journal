import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

export type R2Env = {
  accountId: string;
  accessKeyId: string;
  secretAccessKey: string;
  bucket: string;
  publicUrl: string;
};

export function readR2Env(): R2Env | undefined {
  const accountId = process.env.R2_ACCOUNT_ID?.trim();
  const accessKeyId = process.env.R2_ACCESS_KEY_ID?.trim();
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY?.trim();
  const publicUrl = process.env.R2_PUBLIC_URL?.trim()?.replace(/\/$/, "");
  if (!accountId || !accessKeyId || !secretAccessKey || !publicUrl) return undefined;
  return {
    accountId,
    accessKeyId,
    secretAccessKey,
    bucket: process.env.R2_BUCKET?.trim() || "pet-journal",
    publicUrl,
  };
}

let client: S3Client | undefined;

function r2Client(env: R2Env): S3Client {
  client ??= new S3Client({
    region: "auto",
    endpoint: `https://${env.accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: env.accessKeyId,
      secretAccessKey: env.secretAccessKey,
    },
  });
  return client;
}

export async function putR2Object(key: string, bytes: Buffer, mime: string): Promise<string> {
  const env = readR2Env();
  if (!env) throw new Error("R2 not configured");
  await r2Client(env).send(
    new PutObjectCommand({
      Bucket: env.bucket,
      Key: key,
      Body: bytes,
      ContentType: mime,
      CacheControl: "public, max-age=31536000, immutable",
    }),
  );
  return `${env.publicUrl}/${key}`;
}
