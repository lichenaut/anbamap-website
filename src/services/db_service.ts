import sqlite3 from "sqlite3";
import { fetchImageUrl } from "./img_service";
import { DateTime } from "luxon";

interface UrlRegionRow {
  url: string;
  region_code: string;
}

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
  date: string;
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
  return new Promise((resolve) => {
    let url_region_map: Map<string, string[]> = new Map();
    db.serialize(() => {
      db.each(
        "SELECT * FROM url_regions WHERE region_code=?",
        [region],
        (err: Error, row: UrlRegionRow) => {
          if (err) {
            throw err;
          }

          if (url_region_map.get(row.url) === undefined) {
            url_region_map.set(row.url, []);
          }
          url_region_map.get(row.url)?.push(row.region_code);
        },
        (err: Error) => {
          if (err) {
            throw err;
          } else {
            db.each(
              "SELECT * FROM url_regions WHERE region_code!=?",
              [region],
              (err: Error, row: UrlRegionRow) => {
                if (err) {
                  throw err;
                }

                if (!url_region_map.has(row.url)) {
                  return;
                }

                url_region_map.get(row.url)?.push(row.region_code);
              },
              (err: Error) => {
                if (err) {
                  throw err;
                } else {
                  resolve(url_region_map);
                }
              }
            );
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
              date: DateTime.fromSeconds(row.timestamp)
                .setZone("America/New_York")
                .toLocaleString(DateTime.DATETIME_FULL),
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
