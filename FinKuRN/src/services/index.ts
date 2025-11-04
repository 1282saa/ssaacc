/**
 * Services Barrel Export
 *
 * Central export point for all service modules.
 * Import services from this file for cleaner imports.
 *
 * @example
 * ```tsx
 * import { homeService, chatService } from '../services';
 * ```
 */

export { homeService, DUMMY_HOME_DATA } from './homeService';
export { chatService, DUMMY_CHAT_LIST, DUMMY_MESSAGES } from './chatService';
