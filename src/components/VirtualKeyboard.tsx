/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { KeyboardOverlay, KeyboardOverlayProps, ActiveKeystroke } from './KeyboardOverlay.tsx';

export interface VirtualKeyboardProps extends KeyboardOverlayProps {}

export const VirtualKeyboard: React.FC<VirtualKeyboardProps> = (props) => {
  return <KeyboardOverlay {...props} />;
};

export { KeyboardOverlay };
export type { ActiveKeystroke };
