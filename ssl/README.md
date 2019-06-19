# Generating Development SSL Certificate

[Let's Encrypt](https://letsencrypt.org/docs/certificates-for-localhost/) can be used to generate local development SSL certificates.

## Generate Private Key and Self-signed Certificate for localhost

```bash
openssl req -x509 -out ssl/localhost.crt -keyout ssl/localhost.key \
  -newkey rsa:2048 -nodes -sha256 \
  -subj '/CN=localhost' -extensions EXT -config <( \
   printf "[dn]\nCN=localhost\n[req]\ndistinguished_name = dn\n[EXT]\nsubjectAltName=DNS:localhost\nkeyUsage=digitalSignature\nextendedKeyUsage=serverAuth")
```
