/**
 * "id": "5f8d1d8e42c8c0987a692c7d",
    "format": "native",
    "filename": "22(1).png",
    "size": 2711,
    "origin": "upload",
    "mime": "image/png",
    "ext": "png",
    "kind": "image",
    "sha2": "c1746f527adff7263cb6a3a0fa88a8f55885add24fef19664e6cc86e22a0850a",
    "tags": [
        "promotion1"
    ],
    "status": "active",
    "mode": "default",
    "createdAt": "2020-10-19T05:01:02.804Z",
    "expiresAt": "2021-02-16T10:44:58.305Z",
    "lastAccessAt": "2020-10-19T14:30:06.289Z",
    "stats": {
        "downloads": 4,
        "deliveries": 0
    },
    "meta": {
        "height": 277,
        "width": 280
    }
 */
export interface MetaData {
    height: number,
    width: number,
}
export class WassangerFile {
    public id: string;
    public filename: string;
    public size: number;
    public kind: string;
    public extension: string;
    public tags: string[];
    public status: string;
    public createdAt: Date;
    public exipresAt: Date;
    public metadata: MetaData;

    deserializer(input) {
        this.id = input.id;
        this.filename = input.filename;
        this.size = input.size;
        this.kind = input.kind;
        this.extension = input.ext;
        this.status = input.status;
        this.createdAt = input.createdAt;
        this.exipresAt = input.exipresAt;
        this.metadata = input.metadata;
        
        return this;
    }
    
}