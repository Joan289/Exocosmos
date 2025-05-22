import { Response } from 'supertest';

/**
 * Logs the response body to the console only if the response status code 
 * does not match the expected one.
 *
 * @param res - The Supertest response object.
 * @param expectedStatus - The expected HTTP status code for the test case.
 * @param label - A short description of the test case, used as a log prefix.
 */
export function logIfFailed(res: Response, expectedStatus: number, label: string): void {
  if (res.status !== expectedStatus) {
    console.log(`❌ ${label} failed with status ${res.status} (expected ${expectedStatus}):`);
    console.log(JSON.stringify(res.body, null, 2));
  }
}
