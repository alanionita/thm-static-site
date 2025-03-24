import type { PlaywrightTestConfig } from '@playwright/test';
import { devices } from 'playwright';

const config: PlaywrightTestConfig = {
	webServer: {
		command: 'npm run build && npm run preview',
		port: 4173
	},
	testDir: 'tests',
	testMatch: /(.+\.)?(test|spec)\.[jt]s/,
	projects: [
		// Mobile devices
		{
			name: 'iPhone 6 landscape',
			use: {
				...devices['iPhone 6'],
				isMobile: true,
				hasTouch: true,
				viewport: { width: 667, height: 375 } // Landscape orientation
			},
		},
		{
			name: 'iPhone 6',
			use: devices['iPhone 6'],
		},
		{
			name: 'iPad (gen 6)',
			use: devices['iPad (gen 6)'],
		},
		{
			name: 'iPad (gen 6) landscape',
			use: {
				...devices['iPad (gen 6)'],
				viewport: { width: 1024, height: 768 } // Landscape
			},
		},
		// Desktop resolution
		{
			name: 'Desktop 1920x1080',
			use: {
				viewport: { width: 1920, height: 1080 },
				isMobile: false,
				defaultBrowserType: 'chromium'
			},
		}
	],
	snapshotDir: './snapshots',
	expect: {
		toHaveScreenshot: {
			animations: 'disabled',
			threshold: 0.2,
			maxDiffPixels: 100,
			
		},
	},
};

export default config;
