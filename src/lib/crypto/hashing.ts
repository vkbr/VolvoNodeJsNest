import { Injectable } from '@nestjs/common';
import { createHash } from 'node:crypto';

@Injectable()
export class HashingUtil {
  hashPassword(password: string, salt = 'afb6565ac5eec21ef060f68225ac0156') {
    const hash = createHash('sha256');
    hash.update(salt);
    hash.update(password);
    return hash.digest('hex');
  }
}
