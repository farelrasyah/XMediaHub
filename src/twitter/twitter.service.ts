import { Injectable, InternalServerErrorException } from '@nestjs/common';
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
   * Minta JSON dari Worker (preview + variants)
   */
  async resolve(url: string, index?: number, includeAll?: boolean): Promise<WorkerJson> {
    const wurl = new URL(this.workerUrl);
    // Worker di-root path: tambahkan query
    wurl.searchParams.set('tweet', url);
    wurl.searchParams.set('output', 'json');
    if (index !== undefined) wurl.searchParams.set('index', String(index));
    if (includeAll) wurl.searchParams.set('all', '1');

    const { data } = await axios.get<WorkerJson>(wurl.toString(), {
      timeout: 20000,
      headers: { 'user-agent': 'Mozilla/5.0' },
    });

    if (!data?.success) {
      throw new InternalServerErrorException('Worker did not return success');
    }
    return data;
  }
}
