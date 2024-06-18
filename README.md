# Anbamap Website

This repository contains the website software for Anbamap.

Home page: ...

&nbsp;

## Overview

Anbamap Website displays media scraped from [specific sources] onto a Leaflet map. Users can visit region media organized by day, favorite regions, and use Geokeys to visit other regions on the same day.

About page: ...

FAQ page: ...

&nbsp;

## Tools

### Programming

Anbamap Website uses [Leaflet](https://leafletjs.com/) for the interactive, colored map, [Astro](https://astro.build/) framework, [NaturalEarth](https://www.naturalearthdata.com/downloads/110m-cultural-vectors/) for region information, [MyGeoData](https://mygeodata.cloud/converter/shp-to-geojson) to convert the aforementioned region information into GeoJSON.

### News Sources

#### Youtube:

`https://www.youtube.com/@amnesty/videos`
`https://www.youtube.com/@antiwarnews/videos`
`https://www.youtube.com/@BreakThroughNews/videos`
`https://www.youtube.com/@democracyatwrk/videos`
`https://www.youtube.com/@DemocracyNow/videos`
`https://www.youtube.com/@DoubleDownNews/videos`
`https://www.youtube.com/@EmpireFiles/videos`
`https://www.youtube.com/@firstthoughtnews/videos`
`https://www.youtube.com/@GoodMorningBadNews/videos`
`https://www.youtube.com/@TheMarshallProject/videos`
`https://www.youtube.com/@MiddleEastEye/videos`
`https://www.youtube.com/@MintPressNews/videos`
`https://www.youtube.com/@moreperfectunion/videos`

#### Substack:

`https://chrishedges.substack.com/archive`
`https://mearsheimer.substack.com/archive`

#### Misc:

`https://accuracy.org/news-releases/`
`https://www.amnestyusa.org/news/`
`https://www.antiwar.com/latest.php`
`https://caitlinjohnstone.com.au/category/article/`
`https://consortiumnews.com/`
`https://www.democracynow.org/headlines`
`https://electronicintifada.net/`
`https://geopoliticaleconomy.com/`
`https://thegrayzone.com/`
`https://www.hrw.org/news`
`https://theintercept.com/`
`https://www.jonathan-cook.net/blog/`
`https://www.opensecrets.org/news/`
`https://www.opensecrets.org/news/reports`
`https://www.optout.news/latest`
`https://www.propublica.org/archive`/
`https://truthout.org/latest/`
`https://www.typeinvestigations.org/all/`
`https://unicornriot.ninja/category/global/`

&nbsp;

## Environment Variables

| Environment Variable | Description                                       |
| -------------------- | ------------------------------------------------- |
| `DOCKER_VOLUME`      | Arbitrarily-valued path. Only mandatory variable. |
| `YOUTUBE_API_KEY`    | Your Youtube Data API key.                        |
