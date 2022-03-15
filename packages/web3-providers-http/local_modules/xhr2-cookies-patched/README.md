# XMLHttpRequest polyfill for node.js

Based on [https://github.com/souldreamer/xhr2-cookies](https://github.com/souldreamer/xhr2-cookies)

* Adds support for cookies
* Adds in-project TypeScript type definitions
* Switched to TypeScript

### Cookies

* saved in `XMLHttpRequest.cookieJar`
* saved between redirects
* saved between requests
* can be cleared by doing:
```typescript
import * as Cookie from 'cookiejar';
XMLHttpRequest.cookieJar = Cookie.CookieJar();
```

### Aims

* Provide full XMLHttpRequest features to Angular Universal HttpClient &
`node-angular-http-client`

### Changelog

#### `1.1.0`
* added saving of cookies between requests, not just redirects
* bug fixes
* most tests from `xhr2` ported over and passing
