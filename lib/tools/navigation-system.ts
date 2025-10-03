/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import { FunctionCall } from '../state';
import { FunctionResponseScheduling } from '@google/genai';

export const navigationSystemTools: FunctionCall[] = [
  {
    name: 'find_route',
    description: 'Tìm một tuyến đường đến một điểm đến được chỉ định.',
    parameters: {
      type: 'OBJECT',
      properties: {
        destination: {
          type: 'STRING',
          description: 'The destination address or landmark.',
        },
        modeOfTransport: {
          type: 'STRING',
          description: 'The mode of transport (e.g., driving, walking, cycling).',
        },
      },
      required: ['destination'],
    },
    isEnabled: true,
    scheduling: FunctionResponseScheduling.INTERRUPT,
  },
  {
    name: 'find_nearby_places',
    description: 'Tìm các địa điểm gần đó thuộc một loại nhất định.',
    parameters: {
      type: 'OBJECT',
      properties: {
        placeType: {
          type: 'STRING',
          description: 'The type of place to search for (e.g., restaurant, gas station, park).',
        },
        radius: {
          type: 'NUMBER',
          description: 'The search radius in kilometers.',
        },
      },
      required: ['placeType'],
    },
    isEnabled: true,
    scheduling: FunctionResponseScheduling.INTERRUPT,
  },
  {
    name: 'get_traffic_info',
    description: 'Nhận thông tin giao thông thời gian thực cho một vị trí được chỉ định.',
    parameters: {
      type: 'OBJECT',
      properties: {
        location: {
          type: 'STRING',
          description: 'The location to get traffic information for.',
        },
      },
      required: ['location'],
    },
    isEnabled: true,
    scheduling: FunctionResponseScheduling.INTERRUPT,
  },
];