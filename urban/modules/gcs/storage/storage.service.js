import { Storage } from "../../../mock.js";

const GCS_CREATIVE_BUCKET_NAME = process.env.GCS_CREATIVE_BUCKET_NAME;

const storage = new Storage();

const StorageService = {
  uploadObjectToCreativesBucket: async ({
    filePath,
    destination,
  }) => {
    return storage.bucket(GCS_CREATIVE_BUCKET_NAME).upload(filePath, {
      destination,
    });
  },
};

export default StorageService;
