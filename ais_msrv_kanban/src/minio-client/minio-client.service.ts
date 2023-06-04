import { Injectable } from '@nestjs/common';
import * as Minio from "minio"

@Injectable()
export class MinioClientService {
    private minioClient: Minio.Client

    constructor() {
        console.log(process.env.BUCKET_NAME);
        console.log(process.env.MINIO_ACCESS_KEY);
        
        this.minioClient = new Minio.Client({
            endPoint: process.env.MINIO_END_POINT,
            accessKey: process.env.MINIO_ACCESS_KEY,
            secretKey: process.env.MINIO_SECRET_KEY
        })
    }

    async uploadFile(file: Express.Multer.File) { 
        const fileName = Buffer.from(file.originalname, 'latin1').toString('utf8')
        await this.minioClient.putObject(
            process.env.BUCKET_NAME,
            fileName,
            file.buffer,
            file.size
        )
        return fileName
    }

    async getFileUrl(fileName: string) {
        return this.minioClient.presignedUrl(
            "GET",
            process.env.BUCKET_NAME,
            fileName
        )
    }

    async removeFile(fileName: string) {
        await this.minioClient.removeObject(process.env.BUCKET_NAME, fileName)
        return fileName
    }
}
