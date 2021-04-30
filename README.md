# test-netlify-plugin-nextjs-cookies

It looks like multiple cookies are not correctly serialized when the browser sends multiple cookie headers over HTTP/2.

## Steps to reproduce

1. Test locally

   ```
   yarn
   yarn dev
   ```

   Open http://localhost:3000/ and click on the button to generate 2 cookies. The site should reload and show `"first=1; second=2"`. Those are serialized correctly. You can see in the browser devtools that it uses HTTP/1.1.

2. Test on Netlify

   ```
   export NETLIFY_SITE_ID=your_site_id
   yarn
   yarn deploy
   ```

   Open deployed site and click on the button to generate 2 cookies. The site should reload and show `"first=1,second=2"`. Those are _not_ serialized correctly. They are separated by a comma instead of semicolon. You should see in the browser devtools that it uses HTTP/2.

## Investigation

We investigated further and saw in Wireshark, that browsers send multiple cookie headers when using HTTP/2:

```
cookie: first=1
cookie: second=2
```

but only 1 header with using HTTP/1.1:

```
cookie: first=1; second=2
```

This distinction is _not_ visible in browser devtools, sadly. But it seems to be according to the spec.

We think the code that serializes with a comma instead of semicolon is this line:

https://github.com/netlify/netlify-plugin-nextjs/blob/46526f955240dfcd1f65c4ecfa0c563ce2b1362d/src/lib/templates/createRequestObject.js#L64
