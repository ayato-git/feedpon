interface ParsedUrl {
    protocol: string;  // => "http:"
    hostname: string;  // => "example.com"
    port: string;      // => "3000"
    pathname: string;  // => "/pathname/"
    search: string;    // => "?search=test"
    hash: string;      // => "#hash"
    host: string;      // => "example.com:3000"
}
