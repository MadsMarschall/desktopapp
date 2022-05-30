import { Channels } from '../../main/preload';
import { Methods } from '../Constants';

export interface ClientRequestor {
  sendMessage(channel: Channels, args: unknown[]): void;

  on(
    channel: string,
    func: (...args: unknown[]) => void
  ): (() => void) | undefined;

  once(channel: string, func: (...args: unknown[]) => void): void;

  invoke(
    channel: string,
    id: string,
    method: Methods,
    ...args: unknown[]
  ): Promise<unknown>;
}
