# Changelog

All notable changes to this project will be documented in this file.

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
- Security vulnerability patched in token generation.

## [2.0.0] - 2024-01-15

### Added

- Initial release of version 2.0 with a complete backend refactor.