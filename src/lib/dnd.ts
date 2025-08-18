import { Buckets } from "./types";

export function move(
  buckets: Buckets,
  fromBucket: string,
  toBucket: string,
  itemId: string
): Buckets {
  if (fromBucket === toBucket) return buckets;

  const newBuckets = { ...buckets };

  // Parse item ID to get the actual bucket name and index
  const [actualFromBucket, indexStr] = itemId.split("-");
  const fromIndex = parseInt(indexStr);

  // Use the actual bucket name from itemId instead of fromBucket parameter
  const sourceBucket = actualFromBucket as keyof Buckets;
  const targetBucket = toBucket as keyof Buckets;

  // Validate bucket names
  if (!isValidBucket(sourceBucket) || !isValidBucket(targetBucket)) {
    return buckets;
  }

  // Validate index
  if (
    isNaN(fromIndex) ||
    fromIndex < 0 ||
    fromIndex >= newBuckets[sourceBucket].length
  ) {
    return buckets;
  }

  // Get the item from source bucket
  const item = newBuckets[sourceBucket][fromIndex];

  if (!item) {
    return buckets;
  }

  // Remove from source
  newBuckets[sourceBucket] = newBuckets[sourceBucket].filter(
    (_, i) => i !== fromIndex
  );

  // Add to destination
  newBuckets[targetBucket] = [...newBuckets[targetBucket], item];

  return newBuckets;
}

export function reorder(
  buckets: Buckets,
  bucket: string,
  fromId: string,
  toId: string
): Buckets {
  const newBuckets = { ...buckets };

  // Parse IDs to get indices
  const [, fromIndexStr] = fromId.split("-");
  const [, toIndexStr] = toId.split("-");

  const fromIndex = parseInt(fromIndexStr);
  const toIndex = parseInt(toIndexStr);

  // Validate bucket name
  if (!isValidBucket(bucket)) {
    return buckets;
  }

  // Validate indices
  if (
    isNaN(fromIndex) ||
    isNaN(toIndex) ||
    fromIndex < 0 ||
    toIndex < 0 ||
    fromIndex >= newBuckets[bucket as keyof Buckets].length ||
    toIndex >= newBuckets[bucket as keyof Buckets].length
  ) {
    return buckets;
  }

  const items = [...newBuckets[bucket as keyof Buckets]];
  const [removed] = items.splice(fromIndex, 1);
  items.splice(toIndex, 0, removed);
  newBuckets[bucket as keyof Buckets] = items;

  return newBuckets;
}

export function remove(buckets: Buckets, itemId: string): Buckets {
  const newBuckets = { ...buckets };

  // Parse item ID to get the actual bucket name and index
  const [actualBucket, indexStr] = itemId.split("-");
  const index = parseInt(indexStr);

  const bucket = actualBucket as keyof Buckets;

  // Validate bucket name
  if (!isValidBucket(bucket)) {
    return buckets;
  }

  // Validate index
  if (isNaN(index) || index < 0 || index >= newBuckets[bucket].length) {
    return buckets;
  }

  // Remove item at the specified index
  newBuckets[bucket] = newBuckets[bucket].filter((_, i) => i !== index);

  return newBuckets;
}

export function update(
  buckets: Buckets,
  itemId: string,
  newText: string
): Buckets {
  const newBuckets = { ...buckets };

  // Parse item ID to get the actual bucket name and index
  const [actualBucket, indexStr] = itemId.split("-");
  const index = parseInt(indexStr);

  const bucket = actualBucket as keyof Buckets;

  // Validate bucket name
  if (!isValidBucket(bucket)) {
    return buckets;
  }

  // Validate index
  if (isNaN(index) || index < 0 || index >= newBuckets[bucket].length) {
    return buckets;
  }

  // Update item text at the specified index
  newBuckets[bucket] = newBuckets[bucket].map((item, i) =>
    i === index ? newText : item
  );

  return newBuckets;
}

function isValidBucket(bucket: string): bucket is keyof Buckets {
  return bucket === "core" || bucket === "growth" || bucket === "optional";
}
