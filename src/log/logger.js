import morgan from 'morgan';
import rfs from 'rotating-file-stream';

/*
 * Rotating write stream. A log file is rotated on fulfilling either:
 * 1. Log file size exceeds logOptions.fileSize, or
 * 2. Log file exists for longer than logOptions.interval.
 */
const createRfsLogStream = logOptions =>
  rfs(logOptions.fileName, {
    path: logOptions.basePath,
    interval: logOptions.interval,
    size: logOptions.fileSize,
    compress: logOptions.compressionMethod
  });

const createLogger = logOptions =>
  morgan('combined', { stream: createRfsLogStream(logOptions) });

export default createLogger;
