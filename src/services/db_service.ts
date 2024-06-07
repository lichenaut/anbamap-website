import sqlite3 from "sqlite3";
import { fetchImageUrl } from "./img_service";

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
  return new sqlite3.Database(
    "/home/lichenaut/Downloads/media_db.sqlite",
    (err) => {
      if (err) {
        throw err;
      }
    }
  );
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
  let url_region_map: Map<string, string[]> = new Map();
  return new Promise((resolve) => {
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
            throw err;
          }

          if (url_region_map.get(row.url) === undefined) {
            url_region_map.set(row.url, []);
          }
          url_region_map.get(row.url)?.push(row.region_code);

          if (row.other_region_code !== null) {
            url_region_map.get(row.url)?.push(row.other_region_code);
          }
        },
        (err: Error) => {
          if (err) {
            throw err;
          } else {
            resolve(url_region_map);
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
        [rangeMin, rangeMax],
        (err: Error, row: UrlRow) => {
          if (err) {
            console.error(err.message);
            reject(err);
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
  return new Promise((resolve) => {
    db.serialize(() => {
      db.get(
        `SELECT COUNT(*) AS count 
         FROM urls 
         JOIN url_regions ON urls.url = url_regions.url 
         WHERE url_regions.region_code = ? AND urls.timestamp >= ? AND urls.timestamp < ?`,
        [region, rangeMin, rangeMax],
        (err: Error, row: { count: number }) => {
          if (err) {
            throw err;
          } else {
            resolve(row.count);
          }
        }
      );
    });
  });
}
