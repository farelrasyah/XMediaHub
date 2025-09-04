import {
  Controller, Get, Query, Res, BadRequestException, InternalServerErrorException
} from '@nestjs/common';
import { Response } from 'express';
import { TwitterService } from './twitter.service';
import { ResolveDto } from './dto/resolve.dto';
import { DownloadDto } from './dto/download.dto';
import { AudioDto } from './dto/audio.dto';
import { pickBestVariant, pickByBitrate, sanitizeFilename } from '../common/utils';
import { ApiTags, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';

@ApiTags('twitter')
@Controller('twitter')
export class TwitterController {
  constructor(private readonly svc: TwitterService) {}

  /**
   * Preview + daftar opsi varian (mirip "streams" di YouTube case)
   * GET /twitter/resolve?url=...&index=0&all=1
   */
  @Get('resolve')
  @ApiOperation({ summary: 'Resolve Twitter media', description: 'Get tweet info and available media variants' })
  @ApiQuery({ name: 'url', description: 'Twitter tweet URL', example: 'https://twitter.com/username/status/123456789' })
  @ApiQuery({ name: 'index', required: false, description: 'Media index if multiple', example: '0' })
  @ApiQuery({ name: 'all', required: false, description: 'Include all variants (1 for yes)', example: '1' })
  @ApiResponse({ status: 200, description: 'Media resolved successfully' })
  async resolve(@Query() q: ResolveDto) {
    const includeAll = q.all === '1';
    const json = await this.svc.resolve(q.url, q.index, includeAll);
    const variants = json.media?.variants || [];

    return {
      success: true,
      tweet: json.tweet,
      media: {
        type: json.media.type,
        thumbnail: json.media.thumbnail,
        best: json.media.best,
        variants: variants.map(v => ({
          label: v.label || (v.height ? `${v.height}p` : `${Math.round((v.bitrate || 0) / 1000)}kbps`),
          bitrate: v.bitrate || null,
          width: v.width || null,
          height: v.height || null,
          url: v.url,
          contentType: (v as any).content_type,
        })),
      },
    };
  }

  /**
   * Redirect 302 ke MP4 (pilih varian berdasarkan bitrate, default best)
   * GET /twitter/download?url=...&bitrate=...
   */
  @Get('download')
  @ApiOperation({ summary: 'Download Twitter video', description: 'Redirect to video URL based on bitrate' })
  @ApiQuery({ name: 'url', description: 'Twitter tweet URL', example: 'https://twitter.com/username/status/123456789' })
  @ApiQuery({ name: 'index', required: false, description: 'Media index if multiple', example: '0' })
  @ApiQuery({ name: 'bitrate', required: false, description: 'Desired bitrate (e.g., 720)', example: '720' })
  @ApiResponse({ status: 302, description: 'Redirect to video URL' })
  @ApiResponse({ status: 400, description: 'No variants available' })
  async download(@Query() q: DownloadDto, @Res() res: Response) {
    const json = await this.svc.resolve(q.url, q.index, true);
    const variants = json.media?.variants || [];
    if (!variants.length) throw new BadRequestException('Tidak ada varian video');

    const sel = q.bitrate ? pickByBitrate(variants, q.bitrate) : pickBestVariant(variants);
    if (!sel?.url) throw new InternalServerErrorException('Gagal menentukan varian');

    return res.redirect(302, sel.url);
  }

  /**
   * Ambil audio langsung (tanpa ffmpeg transcode)
   * GET /twitter/audio?url=...&bitrate=128&filename=optional
   */
  @Get('audio')
  @ApiOperation({ summary: 'Download Twitter audio', description: 'Redirect to audio URL' })
  @ApiQuery({ name: 'url', description: 'Twitter tweet URL', example: 'https://twitter.com/username/status/123456789' })
  @ApiQuery({ name: 'index', required: false, description: 'Media index if multiple', example: '0' })
  @ApiQuery({ name: 'filename', required: false, description: 'Custom filename', example: 'my-audio' })
  @ApiResponse({ status: 302, description: 'Redirect to audio URL' })
  @ApiResponse({ status: 400, description: 'No audio variant available' })
  async audio(@Query() q: AudioDto, @Res() res: Response) {
    const json = await this.svc.resolve(q.url, q.index, true);
    const variants = json.media?.variants || [];
    if (!variants.length) throw new BadRequestException('Tidak ada varian audio/video');

    // cari variant audio/mp4
    const audioVariant = variants.find(v => (v as any).content_type?.startsWith('audio/'));
    if (!audioVariant?.url) throw new InternalServerErrorException('Gagal ambil sumber audio');

    const base = sanitizeFilename(
      q.filename ||
      json.tweet?.author_username?.concat('-', json.tweet?.id || 'twitter') ||
      'twitter-audio'
    ) || 'twitter-audio';

    res.setHeader('Content-Type', 'audio/mp4');
    res.setHeader('Content-Disposition', `attachment; filename="${base}.m4a"`);

    return res.redirect(302, audioVariant.url);
  }
}
