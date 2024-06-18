import sqlite3 from "sqlite3";
import { fetchImageUrl } from "./img_service";
import { EnvService } from "./var_service";

interface UrlRow {
  url: string;
  timestamp: number;
  title: string;
  body: string;
}

export interface MediaEntry {
  url: string;
  image_url: string;
  timestamp: number;
  title: string;
  body: string;
  regions: string[];
}

export function getDatabase(): sqlite3.Database {
  let DOCKER_VOLUME = EnvService.getEnvVar("DOCKER_VOLUME");
  if (DOCKER_VOLUME === undefined) {
    throw new Error("DOCKER_VOLUME is not defined");
  }

  return new sqlite3.Database(DOCKER_VOLUME + "/media_db.sqlite", (err) => {
    if (err) {
      throw err;
    }
  });
}

export function closeDatabase(db: sqlite3.Database) {
  db.close((err) => {
    if (err) {
      throw err;
    }
  });
}

export function getUrlsRegions(
  db: sqlite3.Database,
  region: string
): Promise<Map<string, string[]>> {
  let url_region_map: Map<string, Set<string>> = new Map();
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.each(
        `SELECT r1.url, r1.region_code, r2.region_code AS other_region_code
         FROM url_regions AS r1
         LEFT JOIN url_regions AS r2 ON r1.url = r2.url AND r2.region_code != ?
         WHERE r1.region_code = ?`,
        [region, region],
        (
          err: Error,
          row: { url: string; region_code: string; other_region_code: string }
        ) => {
          if (err) {
            reject(err);
            return;
          }

          if (url_region_map.get(row.url) === undefined) {
            url_region_map.set(row.url, new Set());
          }
          url_region_map.get(row.url)?.add(row.region_code);
          if (row.other_region_code !== null) {
            url_region_map.get(row.url)?.add(row.other_region_code);
          }
        },
        (err: Error) => {
          if (err) {
            reject(err);
          } else {
            const result = new Map<string, string[]>();
            for (const [url, regionSet] of url_region_map) {
              result.set(url, Array.from(regionSet));
            }
            resolve(result);
          }
        }
      );
    });
  });
}

export function getUrlsAll(
  db: sqlite3.Database
): Promise<Map<string, string[]>> {
  let url_all_map: Map<string, Set<string>> = new Map();
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.each(
        `SELECT r1.url, r1.region_code, r2.region_code AS other_region_code
         FROM url_regions AS r1
         LEFT JOIN url_regions AS r2 ON r1.url = r2.url AND r2.region_code != r1.region_code`,
        (
          err: Error,
          row: { url: string; region_code: string; other_region_code: string }
        ) => {
          if (err) {
            reject(err);
            return;
          }

          if (!url_all_map.has(row.url)) {
            url_all_map.set(row.url, new Set());
          }
          url_all_map.get(row.url)?.add(row.region_code);
          if (row.other_region_code !== null) {
            url_all_map.get(row.url)?.add(row.other_region_code);
          }
        },
        (err: Error) => {
          if (err) {
            reject(err);
          } else {
            const result = new Map<string, string[]>();
            for (const [url, regionSet] of url_all_map) {
              result.set(url, Array.from(regionSet));
            }
            resolve(result);
          }
        }
      );
    });
  });
}

export function getMediaEntries(
  db: sqlite3.Database,
  urls_regions: Map<string, string[]>,
  rangeMin: number,
  rangeMax: number
): Promise<MediaEntry[]> {
  return new Promise((resolve, reject) => {
    let media_entries: MediaEntry[] = [];
    let promises: Promise<void>[] = [];
    db.serialize(() => {
      db.each(
        "SELECT * FROM urls WHERE timestamp >= ? AND timestamp < ?",
        [rangeMin - 43200, rangeMax + 43200],
        (err: Error, row: UrlRow) => {
          if (err) {
            reject(err);
            return;
          }

          if (!urls_regions.has(row.url)) {
            return;
          }

          let regions = urls_regions.get(row.url);
          if (regions === undefined) {
            return;
          }

          let promise = fetchImageUrl(row.url).then((image_url) => {
            media_entries.push({
              url: row.url,
              image_url: image_url,
              timestamp: row.timestamp,
              title: row.title,
              body: row.body,
              regions: regions,
            });
          });
          promises.push(promise);
        },
        (err: Error) => {
          if (err) {
            reject(err);
          } else {
            Promise.all(promises)
              .then(() => resolve(media_entries))
              .catch(reject);
          }
        }
      );
    });
  });
}

export function getRegionMediaCount(
  db: sqlite3.Database,
  region: string,
  rangeMin: number,
  rangeMax: number
): Promise<number> {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.get(
        `SELECT COUNT(*) AS count 
         FROM urls 
         JOIN url_regions ON urls.url = url_regions.url 
         WHERE url_regions.region_code = ? AND urls.timestamp >= ? AND urls.timestamp < ?`,
        [region, rangeMin, rangeMax],
        (err: Error, row: { count: number }) => {
          if (err) {
            reject(err);
          } else {
            resolve(row.count);
          }
        }
      );
    });
  });
}
