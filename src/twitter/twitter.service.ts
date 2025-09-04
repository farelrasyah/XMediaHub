import {
  Injectable,
  HttpException,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { WorkerJson } from './type';

@Injectable()
export class TwitterService {
  private readonly workerUrl: string;

  constructor(private readonly config: ConfigService) {
    this.workerUrl = this.config.get<string>('WORKER_URL', '').replace(/\/+$/, '');
    if (!this.workerUrl) {
      throw new Error('WORKER_URL is not set in environment');
    }
  }

  /**
   * Utility: Bersihkan URL tweet (hilangkan query seperti ?t=...&s=...)
   */
  private sanitizeTweetUrl(url: string): string {
    try {
      const u = new URL(url);
      return `${u.origin}${u.pathname}`;
    } catch {
      return url; // fallback: biarkan apa adanya
    }
  }

  /**
   * Minta JSON dari Worker (preview + variants)
   */
  async resolve(
    url: string,
    index?: number,
    includeAll?: boolean,
  ): Promise<WorkerJson> {
    const cleanUrl = this.sanitizeTweetUrl(url);

    const wurl = new URL(this.workerUrl);
    wurl.searchParams.set('tweet', cleanUrl);
    wurl.searchParams.set('output', 'json');
    if (index !== undefined) wurl.searchParams.set('index', String(index));
    if (includeAll) wurl.searchParams.set('all', '1');

    try {
      const { data } = await axios.get<WorkerJson>(wurl.toString(), {
        timeout: 20000,
        headers: { 'user-agent': 'Mozilla/5.0' },
      });

      if (!data?.success) {
        throw new HttpException(
          (data as any)?.error || 'Worker did not return success',
          502, // Bad Gateway: worker gagal
        );
      }

      return data;
    } catch (err: any) {
      if (err.response) {
        // Error dari Worker → lempar sesuai status Worker (404, 429, dll.)
        throw new HttpException(err.response.data, err.response.status);
      }
      throw new InternalServerErrorException('Worker request failed');
    }
  }
}
