import { randomBytes } from 'crypto';

export class ObjectId {
  private data: Buffer;

  // same random bytes for every id in this process
  private static readonly randomPart = randomBytes(4);
  // starts random, then counts up
  private static counter = randomBytes(3).readUIntBE(0, 3);

  constructor(type : number, timestamp : number) {
    this.data = Buffer.alloc(14);

    this.data.writeUInt8(type, 0);
    this.data.writeUIntBE(timestamp, 1, 6);
    this.data.set(ObjectId.randomPart, 7);
    this.data.writeUIntBE(ObjectId.counter, 11, 3);

    // bump counter for next id (3 bytes max)
    ObjectId.counter = (ObjectId.counter + 1) % 0x1000000;
  }

  static generate(type?: number) : ObjectId {
    return new ObjectId(type ?? 0, Date.now());
  }

  toString(encoding?: 'hex' | 'base64'): string {
    return this.data.toString(encoding ?? 'hex');
  }
}
