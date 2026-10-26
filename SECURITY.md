# Security Policy

## Supported versions

Only the latest commit on the default branch, as deployed on Netlify, receives security fixes.

## Reporting a vulnerability

Report privately through GitHub: Security tab, then "Report a vulnerability"
(https://github.com/isaac070405/3D-Anaotmy-Model/security/advisories/new).
Do not open a public issue for a vulnerability.

Include:

- The affected file or URL.
- Steps to reproduce.
- The impact you expect.

## Response targets

- Acknowledgement within 7 days.
- Status update within 14 days.
- Fix or mitigation within 90 days for confirmed issues.

## Scope

In scope: the static site in `Anatomical 3D Model/`, its third-party scripts loaded from CDNs, and `netlify.toml` settings.

Out of scope: vulnerabilities in Netlify, browsers, or third-party CDNs themselves (report those to the vendor), and the accuracy of anatomical content (open a normal issue).

## Notes

The site is static, has no backend, and collects no user data.
