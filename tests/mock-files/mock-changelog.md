# Changelog

All notable changes to this project will be documented in this file.

## [2.3.0] - 2024-09-10

### Added

- Implemented new logging system.

### Fixed

- Resolved issue with session timeout handling.

## [2.2.1] - 2024-08-25

### Changed

- Minor update to UI layout.

## [2.2.0] - 2024-08-20

### Added

- Introduced caching mechanism for API requests.

### Fixed

- Patched a memory leak in the authentication module.

## [2.1.0] - 2024-05-01

### Added

- New authentication system with token-based authorization.
- Added support for multi-factor authentication (MFA).

### Changed

- Updated the password hashing algorithm to use bcrypt version 5.
- Modified the user profile UI for better accessibility.

### Deprecated

- Legacy OAuth integration has been deprecated.

### Unreleased

This feature is in development

### Removed

- Support for Node.js version 12 has been removed.

### Fixed

- Fixed a bug where user sessions were not expiring properly.

### Security

- Security vulnerability patched in token generation.

## [2.0.0] - 2024-01-15

### Added

- Initial release of version 2.0 with a complete backend refactor.
