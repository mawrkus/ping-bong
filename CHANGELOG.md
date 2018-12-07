# Change Log

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## [3.0.5] - 2018-12-07

### Changed

- Updated dependencies

## [3.0.2] -> [3.0.4] - 2018-xx-xx

- ...

## [3.0.1] - 2018-05-04

### Added

- Default "error" statusText on error responses

## [3.0.0] - 2018-05-03

### Changed

- The `includes` parameter is now a mapping between 2 lodash paths to get values from the request/response and set them to the output result

## [2.0.0] - 2018-05-03

### Added

- `htttpOptions` and `includes` options

### Changed

- Switched implementation to a class
- Moved `method`, `url` and `userAgent` options to `httpOptions`
- Reformat output to be a single array which items have the same format

## [1.0.0] - 2018-03-21

### Added

- Initial release as a simple "bong" function
